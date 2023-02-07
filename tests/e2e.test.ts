import { afterAll, beforeAll, describe, test } from "vitest";
import { preview } from "vite";
import { chromium } from "playwright";
import { expect } from "@playwright/test";
import type { Browser, Page } from "playwright";
import type { PreviewServer } from "vite";

describe("Stations", async () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test("should open station page from stations list", async () => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Kaivopuisto" }).click();

    await expect(page).toHaveTitle("Kaivopuisto [1]");
  });

  test("should be able to return from station page", async () => {
    await page.goto("http://localhost:3000/stations/1");
    await page.getByRole("link", { name: "All stations" }).click();

    await expect(page).toHaveURL("http://localhost:3000");
  });

  test("stations list can be filtered", async () => {
    await page.goto("http://localhost:3000");
    await page.getByLabel("Search stations").fill("Kaivo");
    await expect(page.locator(".sidepanel tbody span")).toContainText([
      "Kaivonkatsojanpuisto",
      "Kaivopuisto",
    ]);
  });

  test("stations list search shows no results message", async () => {
    await page.goto("http://localhost:3000");
    await page.getByLabel("Search stations").fill("Lorem ipsum");
    await expect(page.locator(".sidepanel")).toContainText("No stations found");
  });

  test("shows error message for unknown station ids", async () => {
    await page.goto("http://localhost:3000/stations/9999");
    await expect(page.locator(".sidepanel")).toContainText(
      "Unable to find station"
    );
  });

  test("stations details should show top arrival & departure stations", async () => {
    await page.goto("http://localhost:3000/stations/1");
    await expect(page.locator(".sidepanel ul > li:first-child")).toContainText(
      "Hernesaarenranta"
    );
    await page.getByRole("button").filter({ hasText: "departures" }).click();
    await expect(page.locator(".sidepanel ul > li:first-child")).toContainText(
      "Kanavaranta"
    );
  });

  test("stations details should update on month change", async () => {
    await page.goto("http://localhost:3000/stations/21");
    await expect(page.locator(".sidepanel")).toContainText("34 arrivals");
    await page.locator("label").filter({ hasText: "July" }).click();

    await expect(page.locator(".sidepanel")).toContainText("75 arrivals");
  });
});

describe("Journeys", async () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test("journey details should update on month change", async () => {
    await page.goto("http://localhost:3000/journeys");
    await expect(page.locator(".sidepanel")).toContainText("1 Thu, 07:40");
    await page.locator("label").filter({ hasText: "May" }).click();

    await expect(page.locator(".sidepanel")).toContainText("1 Sat, 00:01");
  });

  test("should be able to sort list by departure time", async () => {
    await page.goto("http://localhost:3000/journeys");

    await expect(page.locator(".sidepanel")).toContainText("1 Thu, 07:40");
    await page.getByRole("button").filter({ hasText: "Departure" }).click();
    await expect(page.locator(".sidepanel")).toContainText("30 Fri, 23:45");
  });

  test("should be able to sort list by journey duration", async () => {
    await page.goto("http://localhost:3000/journeys");

    await expect(page.locator(".sidepanel")).toContainText("7 min 43 s");
    await page.getByRole("button").filter({ hasText: "Duration" }).click();
    await page.getByRole("button").filter({ hasText: "Duration" }).click();
    await expect(page.locator(".sidepanel")).toContainText("4 days 1 h 34 min");
  });

  test("should be able to sort list by journey distance", async () => {
    await page.goto("http://localhost:3000/journeys");

    await expect(page.locator(".sidepanel")).toContainText("1.63 km");
    await page.getByRole("button").filter({ hasText: "Distance" }).click();
    await expect(page.locator(".sidepanel")).toContainText("10 m");
  });
});

describe("Error states", async () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.route("http://localhost:3000/api/trpc/**/*", (route) => {
      route.abort();
    });
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  // FIXME: timeout issue?
  test.skip(
    "should show error message on db connection failure",
    async () => {
      await page.goto("http://localhost:3000");
      await expect(
        page.getByText("Error loading, try again later")
      ).toBeVisible();
    },
    { timeout: 10000 }
  );
});
