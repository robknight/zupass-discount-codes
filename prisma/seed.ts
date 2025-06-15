import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Generate 1000 unique DappCon discount codes for Protocol Berg attendees
  const codes = [];
  for (let i = 1; i <= 1000; i++) {
    codes.push(`DAPPCON25-PROTBERG-${i.toString().padStart(4, '0')}`);
  }
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