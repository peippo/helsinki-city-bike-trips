<img src="https://helsinki-city-bike-trips.vercel.app/banner.png" alt="Banner image">

Explore a map of the Helsinki City Bike public bicycle system & the journeys taken.

### <a href="https://helsinki-city-bike-trips.vercel.app/">Open the project</a>

## Tech

- [TypeScript](https://typescriptlang.org)
- [Next.js](https://nextjs.org)
- [Deck.gl](https://deck.gl/)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [Jotai](https://jotai.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

Vector map tiles from [National Land Survey of Finland](https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-vektoritiilet), styled with [Maputnik](https://maputnik.github.io/)

## Running locally

### DB

Start a Postgres database and seed it with the station data & a small set of trips from 2021 (every 100th trip)

```bash
docker compose up
npx prisma db push
npx prisma db seed
```

### App

[Register for an API key](https://omatili.maanmittauslaitos.fi/user/new/avoimet-rajapintapalvelut) at the National Land Survey of Finland and add the key to `.env` (required for the Mapbox Vector Tiles)

```bash
cp .env-example .env
yarn install
yarn dev
```

### Tests

Run Vitest & Playwright tests with or without a browser interface

```bash
yarn test:ui
yarn test
```

## TODO

- Update selected zone details on month change in Traffic view
- Improve the general implementation to allow the use of the complete ~2.7 million trip data set. Seems it's not a great idea to do the average journey distance/duration calculations etc. on the fly in browser from a set of that size.

## Acknowledgements

- [Bicycle station location](https://public-transport-hslhrt.opendata.arcgis.com/datasets/helsingin-ja-espoon-kaupunkipy%C3%B6r%C3%A4asemat-avoin/explore?location=60.214131%2C24.940115%2C10.87) and [journey](https://www.hsl.fi/en/hsl/open-data) data from Helsinki Region Transport HSL
- Project bootstrapped with [create-t3-app](https://github.com/t3-oss/create-t3-app)
