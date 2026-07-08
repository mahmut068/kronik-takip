/**
 * MediTrack Enterprise v11.0
 * Drug Interactions - İlaç Etkileşim Veritabanı
 *
 * Her kayıt:
 *  drug1 / drug2     : İlaç adları (büyük/küçük harf duyarsız eşleşme)
 *  severity          : 'mild' | 'moderate' | 'severe'
 *  description       : Türkçe klinik açıklama
 *  recommendation    : Türkçe klinik öneri
 */

// ─── Veritabanı ───────────────────────────────────────────────────────────────
export const DRUG_INTERACTIONS = [
  // ── SEVERE ──────────────────────────────────────────────────────────────────
  {
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    severity: 'severe',
    description:
      'İkisi birlikte kullanıldığında kanama riski belirgin biçimde artar. Aspirin trombosit fonksiyonunu bozarken Warfarin pıhtılaşma faktörlerini inhibe eder.',
    recommendation:
      'Kombine kullanımdan kaçının. Zorunluysa INR değerleri sık aralıklarla izlenmeli, gastrointestinal koruyucu eklenmeli ve hasta kanama belirtileri açısından uyarılmalıdır.',
  },
  {
    drug1: 'Warfarin',
    drug2: 'İbuprofen',
    severity: 'severe',
    description:
      'NSAİİ olan İbuprofen Warfarin metabolizmasını yavaşlatarak antikoagülan etkiyi artırır ve gastrointestinal kanama riskini önemli ölçüde yükseltir.',
    recommendation:
      'Bu kombinasyondan kesinlikle kaçının. Ağrı kesici gerekiyorsa Parasetamol tercih edilmeli, INR yakından takip edilmelidir.',
  },
  {
    drug1: 'MAO İnhibitörü',
    drug2: 'Sertralin',
    severity: 'severe',
    description:
      'Serotonin sendromuna yol açabilir: hiperpreksi, ajitasyon, miyoklonus, kardiyovasküler instabilite ve ölüm riski mevcuttur.',
    recommendation:
      'Birlikte kullanım kontrendikedir. MAO inhibitörü kesilmesinden en az 14 gün sonra Sertralin başlanabilir.',
  },
  {
    drug1: 'Digoksin',
    drug2: 'Amiodaron',
    severity: 'severe',
    description:
      'Amiodaron, Digoksin plazma konsantrasyonunu %70–100 oranında artırabilir. Digoksin toksisitesi (bulantı, kusma, bradikardi, aritmiler) gelişebilir.',
    recommendation:
      'Digoksin dozu %30–50 azaltılmalı, serum Digoksin düzeyleri ve EKG yakından izlenmelidir.',
  },
  {
    drug1: 'Metotreksat',
    drug2: 'NSAİİ',
    severity: 'severe',
    description:
      'NSAİİ'ler Metotreksat renal klirensini azaltarak plazma düzeyini yükseltir; kemik iliği baskılanması ve hepatotoksisite riski artar.',
    recommendation:
      'Kombinasyondan kaçının. Zorunlu kullanımda tam kan sayımı ve karaciğer fonksiyon testleri haftalık yapılmalıdır.',
  },
  {
    drug1: 'Lityum',
    drug2: 'Diüretik',
    severity: 'severe',
    description:
      'Diüretikler sodyum atılımını artırır; böbrekler bunu kompanse etmek için lityumu geri emer, lityum toksisitesine yol açar.',
    recommendation:
      'Serum lityum düzeyleri sık aralıklarla kontrol edilmeli, diüretik başlanınca Lityum dozu azaltılmalı ve hasta tremor/konfüzyon belirtileri açısından izlenmelidir.',
  },
  {
    drug1: 'Sildenafil',
    drug2: 'Nitrat',
    severity: 'severe',
    description:
      'İkisi birlikte şiddetli hipotansiyona neden olur; kalp yetmezliği, miyokard enfarktüsü ve ölüm riski mevcuttur.',
    recommendation:
      'Bu kombinasyon mutlak kontrendikedir. Nitrat kullanan hastalara Sildenafil ve diğer PDE-5 inhibitörleri yazılmamalıdır.',
  },
  {
    drug1: 'Klopidogrel',
    drug2: 'Omeprazol',
    severity: 'severe',
    description:
      'Omeprazol CYP2C19 enzimini inhibe ederek Klopidogrel'in aktif metabolitine dönüşümünü azaltır, antiplatelet etkiyi düşürür.',
    recommendation:
      'Mide koruyucu gerekirken Pantoprazol veya H2-blokör tercih edilmelidir.',
  },

  // ── MODERATE ────────────────────────────────────────────────────────────────
  {
    drug1: 'Metformin',
    drug2: 'Alkol',
    severity: 'moderate',
    description:
      'Kronik alkol kullanımı laktik asidoz riskini artırır ve Metformin'in hepatik etkisini bozar.',
    recommendation:
      'Hasta düzenli alkol tüketen biriyse Metformin dozu revize edilmeli, karaciğer fonksiyon testleri periyodik kontrol edilmelidir.',
  },
  {
    drug1: 'ACE İnhibitörü',
    drug2: 'Potasyum Tutucu Diüretik',
    severity: 'moderate',
    description:
      'Her iki ilaç da potasyum atılımını azaltır; birlikte kullanımda hiperkalemi ve buna bağlı kardiyak aritmiler gelişebilir.',
    recommendation:
      'Serum potasyum düzeyleri ve renal fonksiyon testleri yakından izlenmelidir.',
  },
  {
    drug1: 'Statin',
    drug2: 'Amiodaron',
    severity: 'moderate',
    description:
      'Amiodaron CYP3A4 enzimini inhibe ederek Statin plazma düzeyini artırır, miyopati ve rabdomiyoliz riski yükselir.',
    recommendation:
      'Statin dozu düşürülmeli, kas ağrısı/zayıflığı belirtileri yakından takip edilmelidir.',
  },
  {
    drug1: 'Siprofloksasin',
    drug2: 'Antasit',
    severity: 'moderate',
    description:
      'Antasit içeriğindeki alüminyum ve magnezyum Siprofloksasin'i bağlayarak emilimini %50–90 oranında azaltabilir.',
    recommendation:
      'Siprofloksasin ile antasit arasında en az 2 saat araç bırakılmalı, tercihen antibiyotik antasidden 2 saat önce alınmalıdır.',
  },
  {
    drug1: 'Metoprolol',
    drug2: 'Verapamil',
    severity: 'moderate',
    description:
      'Her iki ilaç da kalp hızını ve iletimini yavaşlatır; birlikte kullanım şiddetli bradikardi ve AV blok riskini artırır.',
    recommendation:
      'EKG izlemi zorunludur, doz ayarlaması yapılmalı ve kalp hızı düzenli kontrol edilmelidir.',
  },
  {
    drug1: 'Flukonazol',
    drug2: 'Triazolam',
    severity: 'moderate',
    description:
      'Flukonazol, CYP3A4 inhibisyonu yoluyla Triazolam metabolizmasını yavaşlatır; sedatif etki ve solunumsal baskılanma riski artar.',
    recommendation:
      'Triazolam dozu azaltılmalı veya kısa süre için kullanım planlanmalıdır.',
  },
  {
    drug1: 'Paroksetin',
    drug2: 'Tramadol',
    severity: 'moderate',
    description:
      'Paroksetin CYP2D6 inhibisyonu yoluyla Tramadol'ün aktif metabolit oluşumunu azaltır; aynı zamanda serotonerjik etkilerin birikmesi serotonin sendromuna yol açabilir.',
    recommendation:
      'Dikkatli izlem gerektirir; gerekirse alternatif analjezik veya antidepresan tercih edilmelidir.',
  },
  {
    drug1: 'Eritromisin',
    drug2: 'Karbamazepin',
    severity: 'moderate',
    description:
      'Eritromisin CYP3A4 inhibisyonu ile Karbamazepin plazma düzeyini artırır; baş dönmesi, diplopi, ataksi gibi toksisite belirtileri görülebilir.',
    recommendation:
      'Karbamazepin serum düzeyleri izlenmeli, gerekirse doz azaltılmalıdır.',
  },
  {
    drug1: 'Metformin',
    drug2: 'Kontrast Madde',
    severity: 'moderate',
    description:
      'İyotlu kontrast madde akut böbrek hasarına yol açabilir; Metformin böbrek işlevi bozulunca birikir ve laktik asidoz tetiklenebilir.',
    recommendation:
      'Kontrast prosedürden 48 saat önce Metformin kesilmeli, renal fonksiyon normal olduğu doğrulandıktan sonra yeniden başlanmalıdır.',
  },
  {
    drug1: 'Amoksisilin',
    drug2: 'Oral Kontraseptif',
    severity: 'moderate',
    description:
      'Antibiyotikler bağırsak florasını bozarak oral kontraseptiflerin enterohepatik resirkülasyonunu azaltabilir; kontraseptif etkinlik düşebilir.',
    recommendation:
      'Antibiyotik kullanımı süresince ve sonraki 7 gün boyunca ek bariyer yöntemi uygulanmalıdır.',
  },
  {
    drug1: 'İnsulin',
    drug2: 'Beta Bloker',
    severity: 'moderate',
    description:
      'Beta blokerler hipoglisemiye karşı semptomatik uyarıyı (çarpıntı, titreme) maskeler; aynı zamanda hipoglisemiden toparlanmayı geciktirebilir.',
    recommendation:
      'Kan şekeri daha sık ölçülmeli, kardiyoselektif beta bloker tercih edilmeli ve hasta hipoglisemi belirtileri konusunda eğitilmelidir.',
  },

  // ── MILD ────────────────────────────────────────────────────────────────────
  {
    drug1: 'Kaptopril',
    drug2: 'Aspirin',
    severity: 'mild',
    description:
      'Yüksek doz Aspirin, prostaglandin sentezini inhibe ederek ACE inhibitörlerinin antihipertansif etkisini hafifçe azaltabilir.',
    recommendation:
      'Düşük doz Aspirin (≤100 mg/gün) genellikle tolere edilir. Kan basıncı izlemi sürdürülmelidir.',
  },
  {
    drug1: 'Amlodipin',
    drug2: 'Greyfurt Suyu',
    severity: 'mild',
    description:
      'Greyfurt suyu CYP3A4 enzimini inhibe ederek Amlodipin plazma düzeyini artırabilir; hafif hipotansiyon görülebilir.',
    recommendation:
      'Greyfurt suyu tüketiminden kaçınılması önerilir; özellikle ilaç alımından birkaç saat önce ve sonra.',
  },
  {
    drug1: 'Levotiroksin',
    drug2: 'Kalsiyum Takviyesi',
    severity: 'mild',
    description:
      'Kalsiyum, Levotiroksin emilimini bağırsak düzeyinde azaltabilir; tiroid hormon düzeyleri beklenen etkiyi göstermeyebilir.',
    recommendation:
      'Levotiroksin ve kalsiyum takviyesi arasında en az 4 saat araç bırakılmalıdır.',
  },
  {
    drug1: 'Atorvastatin',
    drug2: 'Kolestiramin',
    severity: 'mild',
    description:
      'Kolestiramin Atorvastatin'i bağırsakta bağlayarak emilimini azaltabilir.',
    recommendation:
      'Atorvastatin, Kolestiramin alımından en az 1 saat önce veya 4 saat sonra alınmalıdır.',
  },
  {
    drug1: 'Furosemid',
    drug2: 'Aminoglikozid',
    severity: 'mild',
    description:
      'Her iki ilaç da ototoksik etkilere sahiptir; birlikte kullanım işitme kaybı riskini artırabilir.',
    recommendation:
      'İşitme fonksiyonu periyodik olarak değerlendirilmeli ve mümkünse alternatif antibiyotik tercih edilmelidir.',
  },
  {
    drug1: 'Propranolol',
    drug2: 'Alkol',
    severity: 'mild',
    description:
      'Alkol Propranolol'ün hipotansif etkisini artırabilir; aşırı baş dönmesi veya bayılma riski mevcuttur.',
    recommendation:
      'Alkol tüketimi sınırlandırılmalı, hasta dikkatli olmaya yönlendirilmelidir.',
  },
  {
    drug1: 'Doksisiklin',
    drug2: 'Süt Ürünleri',
    severity: 'mild',
    description:
      'Süt ve süt ürünleri Doksisiklin emilimini kısmi olarak azaltabilir; ancak Tetrasiklin'e kıyasla etki daha hafiftir.',
    recommendation:
      'Doksisiklin süt ürünleriyle alınabilir; ancak en iyi emilim için aç mideye (veya sütsüz) tercih edilmelidir.',
  },
  {
    drug1: 'Metildopa',
    drug2: 'Demir Takviyesi',
    severity: 'mild',
    description:
      'Demir, Metildopa ile şelat oluşturarak biyoyararlanımını azaltabilir.',
    recommendation:
      'İki ilaç arasında en az 2 saat araç bırakılmalıdır.',
  },
  {
    drug1: 'Tetrasiklin',
    drug2: 'Antasit',
    severity: 'mild',
    description:
      'Antasit içindeki kalsiyum, magnezyum ve alüminyum Tetrasiklin emilimini belirgin biçimde azaltır.',
    recommendation:
      'Tetrasiklin antasit alımından 2 saat önce veya 4 saat sonra kullanılmalıdır.',
  },
  {
    drug1: 'Klaritromisin',
    drug2: 'Simvastatin',
    severity: 'moderate',
    description:
      'Klaritromisin güçlü bir CYP3A4 inhibitörüdür; Simvastatin plazma konsantrasyonu belirgin artar, miyopati ve rabdomiyoliz riski yükselir.',
    recommendation:
      'Klaritromisin tedavisi süresince Simvastatin geçici olarak kesilmeli ya da daha düşük riskli bir statine geçilmelidir.',
  },
  {
    drug1: 'Rifampisin',
    drug2: 'Oral Kontraseptif',
    severity: 'severe',
    description:
      'Rifampisin güçlü bir CYP3A4 indükleyicisidir ve oral kontraseptiflerin plazma düzeyini %80'e kadar düşürerek gebe kalma riskini ciddi ölçüde artırır.',
    recommendation:
      'Rifampisin tedavisi süresince ve bittikten sonra 4–8 hafta boyunca ek bariyer yöntemi zorunlu olarak uygulanmalıdır.',
  },
];

// ─── Normalize Edici ──────────────────────────────────────────────────────────
const _normalize = (name = '') => name.toLowerCase().trim();

// ─── Etkileşim Kontrol Fonksiyonu ─────────────────────────────────────────────
/**
 * Hasta ilaç listesindeki olası etkileşimleri döndürür.
 *
 * @param {Array<{name: string}>} medications
 * @returns {Array<Object>} Bulunan etkileşim kayıtları (drug1, drug2, severity, description, recommendation)
 */
export const checkInteractions = (medications = []) => {
  if (!Array.isArray(medications) || medications.length < 2) return [];

  const names = medications.map((m) => _normalize(m?.name ?? ''));
  const found = [];

  for (const interaction of DRUG_INTERACTIONS) {
    const d1 = _normalize(interaction.drug1);
    const d2 = _normalize(interaction.drug2);

    const has1 = names.some((n) => n.includes(d1) || d1.includes(n));
    const has2 = names.some((n) => n.includes(d2) || d2.includes(n));

    if (has1 && has2) {
      // Mükerrer kayıt önle
      const alreadyAdded = found.some(
        (f) =>
          _normalize(f.drug1) === d1 && _normalize(f.drug2) === d2
      );
      if (!alreadyAdded) found.push(interaction);
    }
  }

  // Severity'ye göre sırala: severe → moderate → mild
  const severityOrder = { severe: 0, moderate: 1, mild: 2 };
  found.sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));

  return found;
};

// ─── Renk Yardımcısı ─────────────────────────────────────────────────────────
/**
 * @param {'mild'|'moderate'|'severe'} severity
 * @returns {string} CSS renk değeri
 */
export const getSeverityColor = (severity) => {
  const colors = {
    mild: '#22c55e',      // yeşil
    moderate: '#f59e0b',  // amber
    severe: '#ef4444',    // kırmızı
  };
  return colors[severity] ?? '#6b7280';
};

// ─── Etiket Yardımcısı ────────────────────────────────────────────────────────
/**
 * @param {'mild'|'moderate'|'severe'} severity
 * @returns {string} Türkçe etiket
 */
export const getSeverityLabel = (severity) => {
  const labels = {
    mild: 'Hafif',
    moderate: 'Orta',
    severe: 'Şiddetli',
  };
  return labels[severity] ?? 'Bilinmiyor';
};
