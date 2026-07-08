const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('yansın', 10);
  
  // Find existing admin or create if not exists
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { email: 'baban', password: hash, mustChangePassword: false, loginAttempts: 0, lockedUntil: null }
    });
    console.log('Admin user updated to username: baban, password: yansın');
  } else {
    console.log('Admin user not found!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
