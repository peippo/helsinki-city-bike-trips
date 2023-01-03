import { PrismaClient } from "@prisma/client";
import { seedStations } from "./seed-station";
import { seedJourneys } from "./seed-journeys";

const prisma = new PrismaClient();

async function seed() {
  await seedStations(prisma);
  await seedJourneys(prisma);
}

seed()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
