import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/shared/utils/helpers';
import { BadRequestException } from '@nestjs/common';

config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new BadRequestException('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
    }

  // Upsert ensures the admin is created if it doesn't exist
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {}, // No updates for now
    create: {
      email: adminEmail,
      password: hashPassword(adminPassword),
    },
  });

  console.log('Admin user created or updated:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
