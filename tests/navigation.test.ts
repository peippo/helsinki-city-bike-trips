import { afterAll, beforeAll, describe, test } from "vitest";
import { preview } from "vite";
import { chromium } from "playwright";
import { expect } from "@playwright/test";
import type { Browser, Page } from "playwright";
import type { PreviewServer } from "vite";

describe("Navigation", async () => {
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
