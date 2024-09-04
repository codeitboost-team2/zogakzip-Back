import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createImage = async (filename, url) => {
  return await prisma.image.create({
    data: {
      filename,
      url,
    },
  });
};
