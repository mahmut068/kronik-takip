/**
 * KronikTakip — Devlet Hastanesi Seed Scripti v2
 * Güvenlik güncellemeli schema ile uyumlu
 * 3 doktor + 200 hasta + soru setleri + geçmiş yanıtlar + alarmlar
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt           = require('bcryptjs');
const prisma           = new PrismaClient();

const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick  = (arr) => arr[rand(0, arr.length - 1)];
const randF = (min, max, dec = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const randDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - rand(0, daysAgo));
  d.setHours(rand(7, 21), rand(0, 59), rand(0, 59));
  return d;
};

// TC Kimlik üretici (test amaçlı geçerli format)
const genTC = () => {
  let tc = String(rand(1,9));
  for (let i = 0; i < 9; i++) tc += String(rand(0,9));
  const digits = tc.split('').map(Number);
  const d10 = ((digits[0]+digits[2]+digits[4]+digits[6]+digits[8])*7 - (digits[1]+digits[3]+digits[5]+digits[7])) % 10;
  const d11 = digits.slice(0,10).reduce((a,b) => a+b, 0) % 10;
  return tc + d10 + d11;
};

// ICD-10 kodları
const ICD10 = {
  'Hipertansiyon':            'I10',
  'Tip 2 Diyabet':            'E11',
  'Kalp Yetmezliği':         'I50',
  'KOAH':                     'J44',
  'Astım':                    'J45',
  'Kronik Böbrek Hastalığı':  'N18',
  'Epilepsi':                 'G40',
  'Parkinson':                'G20',
};

const ERKEK_ADLAR = ['Ahmet','Mehmet','Mustafa','Ali','Hüseyin','İbrahim','Hasan','Ömer','Yusuf','Murat','Emre','Burak','Serkan','Kemal','Erdal','Ferhat','Kadir','Oğuzhan','Ramazan','Süleyman','Tuncay','Uğur','Volkan','Yılmaz','Zafer','Adem','Bülent','Cengiz','Deniz','Ege','Fatih','Gökhan','Haluk','İsmet','Cevdet','Kaan','Levent','Metin','Nuri','Orhan'];
const KADIN_ADLAR = ['Fatma','Ayşe','Emine','Hatice','Zeynep','Elif','Meryem','Hacer','Şerife','Gülay','Sevgi','Nurcan','Dilek','Gülsüm','Reyhan','Sema','Tülay','Ülkü','Vildan','Yasemin','Zeliha','Arzu','Berna','Canan','Duygu','Esra','Filiz','Gönül','Hülya','Işıl','Jale','Kübra','Leyla','Mine','Nihal','Özlem','Pakize','Rabiye','Sibel','Tuğba'];
const SOYADLAR   = ['Yılmaz','Kaya','Demir','Çelik','Şahin','Doğan','Arslan','Aydın','Öztürk','Eren','Koç','Kurt','Acar','Güneş','Çetin','Tan','Akgün','Bulut','Ceylan','Demirel','Ekinci','Filiz','Gül','Hancı','Işık','Kaplan','Mutlu','Nas','Özcan','Peker','Sert','Taş','Uçar','Vural','Yıldız','Zengin','Baş','Çavuş','Duman','Erdem'];

const genName = (gender) => {
  const ad = gender === 'E' ? pick(ERKEK_ADLAR) : pick(KADIN_ADLAR);
  return `${ad} ${pick(SOYADLAR)}`;
};
const genPhone = () => {
  const pre = ['530','531','532','533','535','536','537','538','539','541','542','543','544','545','551','552','553','554','555'];
  return `+90${pick(pre)}${String(rand(1000000,9999999))}`;
};
const genBirth = (minAge, maxAge) => {
  const y = new Date().getFullYear() - rand(minAge, maxAge);
  return `${y}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`;
};

const DISEASES = [
  { name:'Hipertansiyon',           threshold:140, unit:'mmHg (Sistolik)',       question:'Bugün büyük tansiyonunuz kaç?',                                 minAge:45,maxAge:80, normal:[105,135], critical:[155,200], min:50,  max:300, weight:0.32 },
  { name:'Tip 2 Diyabet',           threshold:200, unit:'mg/dL (Açlık)',         question:'Bugün açlık kan şekeriniz kaç?',                                 minAge:40,maxAge:75, normal:[80,160],  critical:[220,350], min:30,  max:600, weight:0.25 },
  { name:'Kalp Yetmezliği',        threshold:7,   unit:'Dispne Skoru (1-10)',   question:'Nefes darlığınızı 1-10 arasında değerlendirin.',                  minAge:55,maxAge:85, normal:[1,5],     critical:[8,10],    min:1,   max:10,  weight:0.13 },
  { name:'KOAH',                    threshold:88,  unit:'% SpO₂',               question:'Oksijen satürasyonunuz yüzde kaç?',                              minAge:50,maxAge:82, normal:[92,98],   critical:[82,87],   min:60,  max:100, weight:0.09 },
  { name:'Astım',                   threshold:60,  unit:'PEF (L/dk)',            question:'Tepe akış ölçüm cihazınızdaki değeriniz kaç?',                   minAge:20,maxAge:65, normal:[70,100],  critical:[30,55],   min:10,  max:200, weight:0.07 },
  { name:'Kronik Böbrek Hastalığı', threshold:6,   unit:'mg/dL (Kreatinin)',     question:'Son kreatinin değeriniz kaç?',                                   minAge:50,maxAge:80, normal:[0.6,4.0], critical:[6.5,10],  min:0.1, max:20,  weight:0.06 },
  { name:'Epilepsi',                threshold:1,   unit:'Nöbet Sayısı (Günlük)', question:'Bugün nöbet geçirdiniz mi? Kaç kez?',                            minAge:15,maxAge:60, normal:[0,0],     critical:[2,5],     min:0,   max:20,  weight:0.04 },
  { name:'Parkinson',               threshold:7,   unit:'Titreme Şiddeti (1-10)',question:'El titreme şiddetinizi 1-10 arasında değerlendirin.',             minAge:60,maxAge:85, normal:[1,5],     critical:[8,10],    min:1,   max:10,  weight:0.04 },
];

function pickDisease() {
  let r = Math.random(), cum = 0;
  for (const d of DISEASES) { cum += d.weight; if (r <= cum) return d; }
  return DISEASES[0];
}

function genValue(disease, isCritical) {
  const range = isCritical ? disease.critical : disease.normal;
  return randF(range[0], range[1], disease.unit.includes('mg/dL') || disease.name === 'Parkinson' || disease.name === 'Kalp Yetmezliği' ? 0 : 1);
}

async function main() {
  console.log('🏥 KronikTakip — Devlet Hastanesi Veri Yüklemesi başlıyor...\n');

  const pw = await bcrypt.hash('Admin123!@#', 12); // Yeni şifre politikasına uygun

  const doctors = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@kronik.com' },
      update: { password: pw },
      create: { email:'admin@kronik.com', name:'Dr. Ayşe Kaya', password:pw, role:'ADMIN', specialty:'Dahiliye', department:'Dahiliye Kliniği', phone:'+905321234567', passwordChangedAt: new Date() },
    }),
    prisma.user.upsert({
      where: { email: 'kardiyoloji@kronik.com' },
      update: { password: pw },
      create: { email:'kardiyoloji@kronik.com', name:'Dr. Mehmet Demir', password:pw, role:'DOCTOR', specialty:'Kardiyoloji', department:'Kardiyoloji Kliniği', phone:'+905331234568', passwordChangedAt: new Date() },
    }),
    prisma.user.upsert({
      where: { email: 'noroloji@kronik.com' },
      update: { password: pw },
      create: { email:'noroloji@kronik.com', name:'Dr. Fatma Arslan', password:pw, role:'DOCTOR', specialty:'Nöroloji', department:'Nöroloji Kliniği', phone:'+905421234569', passwordChangedAt: new Date() },
    }),
  ]);

  console.log('✅ 3 doktor oluşturuldu.');
  console.log('   Giriş: admin@kronik.com / Admin123!@#\n');

  // Temizle
  await prisma.patientResponse.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionSet.deleteMany();
  await prisma.responseToken.deleteMany();
  await prisma.smsLog.deleteMany();
  await prisma.eNabizSyncLog.deleteMany();
  await prisma.patient.deleteMany();
  console.log('🧹 Eski veriler temizlendi.\n');
  console.log('👥 200 hasta oluşturuluyor...');

  let alertCount = 0, responseCount = 0;

  for (let i = 0; i < 200; i++) {
    const disease  = pickDisease();
    const doctor   = pick(doctors);
    const isActive = Math.random() > 0.08;
    const literacy = Math.random() > 0.20 ? 'LITERATE' : 'ILLITERATE';
    const gender   = Math.random() > 0.45 ? 'E' : 'K';
    const hasCrit  = Math.random() > 0.75;

    const patient = await prisma.patient.create({
      data: {
        tcKimlik:      genTC(),
        name:          genName(gender),
        phone:         genPhone(),
        birthDate:     genBirth(disease.minAge, disease.maxAge),
        gender,
        disease:       disease.name,
        icdCode:       ICD10[disease.name] || null,
        literacyLevel: literacy,
        contactMethod: literacy === 'ILLITERATE' ? 'VOICE' : 'SMS',
        thresholdValue: disease.threshold,
        thresholdLabel: disease.unit,
        isActive,
        hospitalCode:  'TR-340001', // İstanbul Eğitim ve Araştırma Hastanesi
        notes:         isActive ? null : 'Hasta servise başvurmamaktadır.',
        doctorId:      doctor.id,
      },
    });

    if (isActive) {
      const qs = await prisma.questionSet.create({
        data: { name:`${disease.name} Günlük Takip`, schedule:pick(['08:00','09:00','10:00','17:00']), days:'1,2,3,4,5,6,7', isActive:true, patientId:patient.id },
      });
      const q = await prisma.question.create({
        data: { text:disease.question, responseType:'NUMERIC', unit:disease.unit, orderIndex:0, isThreshold:true, minValue:disease.min, maxValue:disease.max, questionSetId:qs.id },
      });

      const numResp = rand(8, 20);
      let prevTriggered = false;

      for (let r = 0; r < numResp; r++) {
        const isCrit = hasCrit && r >= numResp - rand(1,3);
        const value  = genValue(disease, isCrit);
        const at     = new Date(); at.setDate(at.getDate() - rand(0,29)); at.setHours(rand(7,21), rand(0,59));
        const triggered = disease.name === 'KOAH' ? value < disease.threshold : value > disease.threshold;

        await prisma.patientResponse.create({
          data: { value, rawAnswer:String(value), channel:patient.contactMethod, triggeredAlert:triggered, respondedAt:at, patientId:patient.id, questionId:q.id },
        });
        responseCount++;

        if (triggered && !prevTriggered) {
          const sev = disease.name === 'KOAH' ? 'CRITICAL' : value > disease.threshold * 1.4 ? 'CRITICAL' : 'HIGH';
          const resolved = hasCrit && r < numResp - 2;
          await prisma.alert.create({
            data: { triggerValue:value, thresholdValue:disease.threshold, severity:sev, notifiedDoctor:true, notifiedPatient:false,
              message: disease.name === 'KOAH' ? `SpO₂ kritik: %${value} (Eşik: %${disease.threshold})` : `${disease.name} eşik aşıldı: ${value} ${disease.unit.split('(')[0].trim()} (Eşik: ${disease.threshold})`,
              resolvedAt:resolved ? at : null, resolvedNote:resolved ? 'Hekim tarafından incelendi.' : null,
              patientId:patient.id, doctorId:doctor.id, createdAt:at },
          });
          alertCount++;
          prevTriggered = true;
        }
      }

      // e-Nabız sync log
      await prisma.eNabizSyncLog.create({
        data: { patientId:patient.id, resourceType:'Observation', status: Math.random()>0.05?'SENT':'FAILED', sentAt: Math.random()>0.05?randDate(1):null },
      });

      await prisma.smsLog.create({
        data: { patientId:patient.id, phone:patient.phone, message:`Sayın ${patient.name.split(' ')[0]}, günlük ölçümünüzü hatırlatırız. ${disease.question}`, status:'SENT', sentAt:randDate(1) },
      });
    }

    if ((i+1) % 20 === 0) process.stdout.write(`   ${i+1}/200 oluşturuldu...\r`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Tamamlandı!');
  console.log(`   👥 200 hasta    📋 ${responseCount} yanıt    🚨 ${alertCount} alarm`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 Giriş:  admin@kronik.com  /  Admin123!@#\n');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error('❌', e.message); prisma.$disconnect(); process.exit(1); });
