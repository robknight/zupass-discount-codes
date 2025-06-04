import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const codes = [
    'DISCOUNT2024A',
    'DISCOUNT2024B',
    'DISCOUNT2024C',
    'DISCOUNT2024D',
    'DISCOUNT2024E'
    // Add more codes as needed
  ];
  for (const code of codes) {
    await prisma.voucherCode.create({
      data: { voucher_code: code }
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 