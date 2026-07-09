import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const maleNames = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", "Osman", "Yusuf", "Murat", "Ömer", "Ramazan", "Halil", "Süleyman", "Abdullah", "Mahmut", "Salih", "Recep", "Enes", "Fatih", "Serkan", "Gökhan", "Hakan", "Yasin", "Kemal", "Yavuz", "Oğuz", "Alper", "Emre", "Burak", "Kaan", "Berk"];
const femaleNames = ["Fatma", "Ayşe", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Şerife", "Zehra", "Sultan", "Hanife", "Merve", "Havva", "Zeliha", "Esra", "Fadime", "Özlem", "Hacer", "Yasemin", "Hülya", "Sevim", "Songül", "Gül", "Büşra", "Dilek", "Kübra", "Necla", "Selma", "Tuğba", "Pelin", "Selin", "Ece", "Eda"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Özcan", "Korkmaz", "Erdoğan", "Yavuz", "Can", "Güler", "Aktaş", "Turan"];

const diseases = [
  { name: 'Hipertansiyon', icd: 'I10', threshold: 140, label: 'Büyük Tansiyon (mmHg)' },
  { name: 'Tip 2 Diyabet', icd: 'E11', threshold: 126, label: 'Açlık Kan Şekeri (mg/dL)' },
  { name: 'Kalp Yetmezliği', icd: 'I50', threshold: 120, label: 'Nabız (bpm)' },
  { name: 'KOAH', icd: 'J44', threshold: 92, label: 'SpO2 (%)' },
  { name: 'Koroner Arter', icd: 'I25', threshold: 100, label: 'Kolesterol (mg/dL)' },
  { name: 'Kronik Böbrek', icd: 'N18', threshold: 1.5, label: 'Kreatinin (mg/dL)' }
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const generatePhone = () => `0555${Math.floor(1000000 + Math.random() * 9000000)}`;
const generateTc = () => `${Math.floor(10000000000 + Math.random() * 90000000000)}`;

async function main() {
  console.log('Veritabanı sıfırlanıyor (Mevcut Hastalar Siliniyor)...');
  await prisma.auditLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.patientResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionSet.deleteMany();
  await prisma.patient.deleteMany();

  const password = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: { name: 'Prof. Dr. Serhan Doğan (Bakanlık Yetkilisi)' },
    create: {
      email: 'test@test.com',
      name: 'Prof. Dr. Serhan Doğan (Bakanlık Yetkilisi)',
      password,
      role: 'ADMIN',
      specialty: 'Kardiyoloji & Başhekim'
    },
  });
  
  console.log('200 adet gerçekçi hasta (VIP Demo) oluşturuluyor. Lütfen bekleyin...');
  
  const patientsData = [];
  for (let i = 0; i < 200; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale ? getRandom(maleNames) : getRandom(femaleNames);
    const lastName = getRandom(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    const diseaseObj = getRandom(diseases);
    
    patientsData.push({
      tcKimlik: generateTc(),
      name: fullName,
      phone: generatePhone(),
      gender: isMale ? 'E' : 'K',
      birthDate: `${1940 + Math.floor(Math.random() * 45)}-0${1 + Math.floor(Math.random() * 9)}-1${Math.floor(Math.random() * 9)}`,
      disease: diseaseObj.name,
      icdCode: diseaseObj.icd,
      thresholdValue: diseaseObj.threshold,
      thresholdLabel: diseaseObj.label,
      hospitalCode: 'ANKARA-SEHIR-HST',
      doctorId: user.id,
      literacyLevel: Math.random() > 0.8 ? 'ILLITERATE' : 'LITERATE',
      isActive: Math.random() > 0.05 // %95 aktif
    });
  }

  // Hasta verilerini veritabanına toplu ekleme
  await prisma.patient.createMany({
    data: patientsData
  });

  // Veritabanından geri çekip ID'lerini kullanarak rastgele tepkiler ve alarmlar ekleyelim (Grafikler dolsun)
  const allPatients = await prisma.patient.findMany();
  
  console.log('Sahte hasta metrikleri, risk grafikleri ve alarmlar dolduruluyor...');
  
  let alertsCount = 0;
  for (const p of allPatients) {
    // Rastgele 1 Soru Seti
    const qSet = await prisma.questionSet.create({
      data: {
        name: `Haftalık ${p.disease} Takibi`,
        patientId: p.id,
        questions: {
          create: [
            { text: `Güncel ${p.thresholdLabel} değeriniz nedir?`, isThreshold: true, minValue: 0, maxValue: 300 }
          ]
        }
      },
      include: { questions: true }
    });

    const q = qSet.questions[0];

    // Hastaların %80'i cevap vermiş olsun, bazıları eşiği aşsın
    if (Math.random() > 0.2) {
      const isCritical = Math.random() > 0.85; // %15 ihtimalle alarm
      
      let val = p.thresholdValue * 0.8; // normal
      if (isCritical) {
        val = p.thresholdValue * 1.15; // eşiğin üstü
      }

      await prisma.patientResponse.create({
        data: {
          value: val,
          rawAnswer: `${val.toFixed(1)}`,
          patientId: p.id,
          questionId: q.id,
          triggeredAlert: isCritical,
          respondedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
        }
      });

      if (isCritical) {
        await prisma.alert.create({
          data: {
            triggerValue: val,
            thresholdValue: p.thresholdValue,
            message: `Kritik Eşik Aşıldı: ${p.disease} (${val.toFixed(1)})`,
            severity: 'HIGH',
            patientId: p.id,
            doctorId: user.id,
            resolvedAt: Math.random() > 0.5 ? new Date() : null, // %50'si çözülmüş
          }
        });
        alertsCount++;
      }
    }
  }

  console.log(`Seed başarılı! Kullanıcı, 200 Hasta ve ${alertsCount} Kritik Alarm oluşturuldu.`);
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
