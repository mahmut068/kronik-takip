const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin123!@#', 10);
  
  // Önce varsa eski test hesaplarını silelim veya yeni bir tane oluşturalım.
  // Çakışmayı önlemek için upsert kullanıyoruz.
  const email = 'admin@saglik.gov.tr';
  
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hash,
      loginAttempts: 0,
      lockedUntil: null,
      mustChangePassword: false,
      isActive: true,
      role: 'ADMIN'
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

  console.log(`Yeni hesap oluşturuldu / sıfırlandı. Kullanıcı Adı: ${user.email} | Şifre: Admin123!@#`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
