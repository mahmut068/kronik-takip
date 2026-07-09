const { PrismaClient } = require('./src/generated/prisma');
const p = new PrismaClient();

async function check() {
  const count = await p.patient.count();
  console.log('HASTA SAYISI:', count);
  await p.$disconnect();
}

check().catch(e => {
  console.log('HATA:', e.message);
  p.$disconnect();
});
