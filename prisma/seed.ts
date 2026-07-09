import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'Dr. Serhan Doğan',
      password,
      role: 'DOCTOR',
      specialty: 'Kardiyoloji'
    },
  });

  // Sahte Hastalar Ekle
  const patientNames = ['Ahmet Yılmaz', 'Ayşe Kaya', 'Mehmet Demir', 'Mustafa Çelik', 'Yusuf Can'];
  const diseases = ['Hipertansiyon', 'Diyabet', 'Kalp Yetmezliği', 'Astım', 'KOAH'];
  
  for (let i = 0; i < 5; i++) {
    await prisma.patient.create({
      data: {
        name: patientNames[i],
        phone: `555123456${i}`,
        disease: diseases[i],
        thresholdValue: 120 + i * 5,
        doctorId: user.id,
      }
    });
  }
  
  console.log('Seed başarılı: Kullanıcı ve 5 adet hasta eklendi.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
