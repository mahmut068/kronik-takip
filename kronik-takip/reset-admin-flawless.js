const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  const email = 'admin';
  
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hash,
      loginAttempts: 0,
      lockedUntil: null,
      mustChangePassword: false,
      isActive: true,
      role: 'ADMIN',
      name: 'Sistem Yöneticisi',
    },
    create: {
      email: email,
      password: hash,
      name: 'Sistem Yöneticisi',
      role: 'ADMIN',
      isActive: true,
      mustChangePassword: false,
      loginAttempts: 0
    }
  });

  console.log(`Kusursuz Kurumsal Hesap aktif edildi. Kullanıcı Adı: ${user.email} | Şifre: admin123`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
