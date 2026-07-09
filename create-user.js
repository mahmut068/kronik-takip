const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'dr.admin@klinik.gov.tr';
  const password = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password,
      lockedUntil: null,
      loginAttempts: 0,
      isActive: true,
      mustChangePassword: false
    },
    create: {
      name: 'Dr. Admin',
      email,
      password,
      role: 'DOCTOR',
      isActive: true,
      mustChangePassword: false
    }
  });

  console.log('Kullanici olusturuldu:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
