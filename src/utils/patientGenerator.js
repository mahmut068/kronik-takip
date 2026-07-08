// src/utils/patientGenerator.js
// 997 ek hasta için deterministik (sabit seed) veri üretici

const DISEASES = [
  { name: 'Hipertansiyon',       thresholdRange: [130, 160], valueRange: [85,  195] },
  { name: 'Diyabet Tip 2',       thresholdRange: [180, 230], valueRange: [70,  310] },
  { name: 'Diyabet Tip 1',       thresholdRange: [170, 210], valueRange: [55,  285] },
  { name: 'Kalp Yetmezliği',     thresholdRange: [80,  115], valueRange: [35,  145] },
  { name: 'KOAH',                thresholdRange: [55,   75], valueRange: [22,   92] },
  { name: 'Astım',               thresholdRange: [280, 380], valueRange: [140, 460] },
  { name: 'Böbrek Yetmezliği',   thresholdRange: [50,   85], valueRange: [8,   125] },
  { name: 'Tiroit Bozukluğu',    thresholdRange: [38,   62], valueRange: [8,    95] },
  { name: 'Parkinson',           thresholdRange: [40,   68], valueRange: [8,    90] },
  { name: 'Epilepsi',            thresholdRange: [20,   55], valueRange: [0,    85] },
  { name: 'Osteoporoz',          thresholdRange: [60,   82], valueRange: [15,  105] },
  { name: 'Anemi',               thresholdRange: [70,  105], valueRange: [25,  160] },
  { name: 'Kronik Ağrı Sendromu',thresholdRange: [60,   80], valueRange: [8,   100] },
  { name: 'Romatoid Artrit',     thresholdRange: [30,   58], valueRange: [4,    85] },
  { name: 'Multiple Skleroz',    thresholdRange: [28,   62], valueRange: [3,    95] },
  { name: 'Psoriazis',           thresholdRange: [100, 210], valueRange: [5,   290] },
  { name: 'Karaciğer Sirozu',    thresholdRange: [40,   85], valueRange: [8,   160] },
  { name: 'Lupus (SLE)',         thresholdRange: [38,   80], valueRange: [3,   125] },
  { name: 'Fibromiyalji',        thresholdRange: [50,   72], valueRange: [8,    95] },
  { name: 'Crohn Hastalığı',     thresholdRange: [150, 225], valueRange: [45,  360] },
  { name: 'Ülseratif Kolit',     thresholdRange: [100, 180], valueRange: [20,  250] },
  { name: 'Atriyal Fibrilasyon', thresholdRange: [100, 130], valueRange: [50,  165] },
  { name: 'Koroner Arter Has.',  thresholdRange: [120, 160], valueRange: [60,  200] },
  { name: 'Periferik Arter Has.',thresholdRange: [60,   90], valueRange: [20,  120] },
  { name: 'Derin Ven Trombozu',  thresholdRange: [80,  120], valueRange: [30,  155] },
  { name: 'Gut Hastalığı',       thresholdRange: [60,   90], valueRange: [15,  130] },
  { name: 'Obezite (BMI)',       thresholdRange: [30,   40], valueRange: [18,   55] },
  { name: 'Hiperlipidemi',       thresholdRange: [200, 250], valueRange: [80,  320] },
  { name: 'Metabolik Sendrom',   thresholdRange: [88,  115], valueRange: [60,  145] },
  { name: 'Kronik Migren',       thresholdRange: [10,   18], valueRange: [0,    25] },
  { name: 'Uyku Apnesi',         thresholdRange: [15,   30], valueRange: [2,    50] },
  { name: 'Depresyon (PHQ-9)',   thresholdRange: [10,   15], valueRange: [0,    25] },
  { name: 'Anksiyete Boz.',      thresholdRange: [10,   15], valueRange: [0,    22] },
  { name: 'Alzheimer (MMSE)',    thresholdRange: [20,   26], valueRange: [10,   30] },
  { name: 'Diyabetik Nöropati',  thresholdRange: [55,   80], valueRange: [10,  110] },
  { name: 'Diyabetik Retinopati',thresholdRange: [40,   70], valueRange: [5,   100] },
  { name: 'Nefrotik Sendrom',    thresholdRange: [60,   95], valueRange: [10,  130] },
  { name: 'Sedef Artriti',       thresholdRange: [25,   55], valueRange: [3,    80] },
  { name: 'Skleroderma',         thresholdRange: [30,   60], valueRange: [5,    90] },
  { name: 'Sjögren Sendromu',    thresholdRange: [25,   50], valueRange: [3,    75] },
];

const FIRST_NAMES = [
  'Ahmet','Mehmet','Ali','Mustafa','İbrahim','Hasan','Hüseyin','İsmail','Ömer','Süleyman',
  'Yusuf','Musa','Davut','Halil','Hamza','Bilal','Bekir','Recep','Kadir','Kemal',
  'Fatma','Ayşe','Emine','Hatice','Zeynep','Elif','Meryem','Hacer','Havva','Reyhan',
  'Selma','Gülay','Seda','Gülsüm','Neşe','Hülya','Melek','Tuğba','Büşra','Merve',
  'Can','Cem','Deniz','Emre','Furkan','Gökhan','Hakan','İlhan','Kaan','Levent',
  'Mert','Nail','Onur','Pelin','Ramazan','Sercan','Taner','Uğur','Volkan','Yakup',
  'Zekeriya','Alperen','Barış','Caner','Derya','Erhan','Ferhat','Gizem','Hilal','İrem',
  'Karahan','Latife','Mahmut','Nilüfer','Orhan','Perihan','Rabia','Serdar','Tuncay','Ülkü',
  'Veli','Yeliz','Zülfikar','Adem','Burhan','Coşkun','Dilek','Erdal','Filiz','Güngör',
  'Harun','Işık','Jale','Kamuran','Lütfiye','Muzaffer','Nurcan','Oğuz','Pakize','Resul',
];

const LAST_NAMES = [
  'Yılmaz','Kaya','Demir','Çelik','Şahin','Yıldız','Yıldırım','Öztürk','Arslan','Doğan',
  'Kılıç','Aslan','Çetin','Kara','Koç','Kurt','Aydın','Özdemir','Şimşek','Erdoğan',
  'Polat','Taş','Güneş','Avcı','Bulut','Kaplan','Aktaş','Karahan','Korkmaz','Güler',
  'Çakır','Bal','Toprak','Keskin','Boz','Demirci','Kocaman','Yücel','Tan','Akın',
  'Albayrak','Bozkurt','Ceylan','Demirel','Erbaş','Fidan','Gündüz','Hanım','Işıklı','Kılınç',
];

const HIST_DATES = ['01.06','08.06','15.06','22.06','29.06','05.07','07.07'];

// Hafif deterministik (ama yeterince çeşitli) pseudo-random
// Tamamen aynı sıra her render'da üretilsin diye seed kullanıyoruz
const seededRand = (() => {
  let seed = 42;
  return () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
})();

const randInt = (min, max) => Math.floor(seededRand() * (max - min + 1)) + min;

const calcHealthScore = (value, threshold) => {
  if (value >= threshold) return Math.max(0, 100 - ((value - threshold) * 2) - 40);
  return Math.min(100, Math.round(100 - (value / threshold) * 30));
};

export const generateExtraPatients = (count = 997, startId = 4) => {
  const patients = [];

  for (let i = 0; i < count; i++) {
    const disease     = DISEASES[i % DISEASES.length];
    const firstName   = FIRST_NAMES[(i * 7 + 3) % FIRST_NAMES.length];
    const lastName    = LAST_NAMES[(i * 13 + 5) % LAST_NAMES.length];
    const name        = `${firstName} ${lastName}`;
    const threshold   = randInt(disease.thresholdRange[0], disease.thresholdRange[1]);
    const currentValue = randInt(disease.valueRange[0], disease.valueRange[1]);
    const status      = currentValue >= threshold ? 'danger' : 'safe';
    const healthScore = Math.max(0, Math.min(100, calcHealthScore(currentValue, threshold)));
    const literacy    = seededRand() > 0.35;

    // 3-5 geçmiş veri noktası
    const histLen = randInt(3, 5);
    const history = [];
    for (let j = 0; j < histLen; j++) {
      history.push({
        date:  HIST_DATES[j % HIST_DATES.length],
        value: randInt(disease.valueRange[0], disease.valueRange[1]),
      });
    }

    patients.push({
      id:           startId + i,
      name,
      disease:      disease.name,
      threshold,
      currentValue,
      literacy,
      questions:    [`${disease.name} için günlük takip değeriniz nedir?`],
      status,
      healthScore,
      medications:  [],
      history,
    });
  }

  return patients;
};
