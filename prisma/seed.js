import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const badges = [
    { name: '7일 연속 추억 등록' },
    { name: '추억 수 20개 이상 등록' },
    { name: '그룹 생성 후 1년 달성' },
    { name: '그룹 공간 1만 개 이상 받기' },
    { name: '추억 공감 1만 개 이상 받기' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
}

main()
  .then(() => console.log('Database seeded with badges!'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
