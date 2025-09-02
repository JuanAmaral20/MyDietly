import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const goalsToSeed = [
    { name: 'Ganhar massa muscular' },
    { name: 'Perder peso' },
    { name: 'Manter o peso' },
  ];

  for (const goal of goalsToSeed) {
    await prisma.goal.upsert({ where: { name: goal.name }, update: {}, create: { name: goal.name } });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
