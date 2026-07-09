/**
 * e-Nabız FHIR R4 Entegrasyon Servisi
 * SB e-Nabız API / HL7 FHIR R4 standardı
 * Şu an MOCK modda çalışır — prod'da gerçek endpoint kullanılır
 */

const ENABIZ_BASE_URL = process.env.ENABIZ_API_URL || 'https://enabiz-mock.saglik.gov.tr/fhir/R4';
const ENABIZ_CLIENT_ID = process.env.ENABIZ_CLIENT_ID || 'MOCK_CLIENT';
const ENABIZ_SECRET    = process.env.ENABIZ_SECRET    || 'MOCK_SECRET';

export interface FHIRObservation {
  resourceType: 'Observation';
  id?: string;
  status: 'final' | 'preliminary' | 'amended';
  code: {
    coding: Array<{ system: string; code: string; display: string }>;
    text: string;
  };
  subject: { reference: string };     // Patient/TC_KIMLIK
  effectiveDateTime: string;           // ISO 8601
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  interpretation?: Array<{
    coding: Array<{ system: string; code: string; display: string }>;
  }>;
}

/** Hastalık → LOINC kodu eşleştirme */
const DISEASE_LOINC: Record<string, { code: string; display: string; unit: string; ucum: string }> = {
  'Hipertansiyon':            { code: '8480-6', display: 'Sistolik Kan Basıncı', unit: 'mmHg', ucum: 'mm[Hg]' },
  'Tip 2 Diyabet':            { code: '1558-6', display: 'Açlık Kan Glukozu',    unit: 'mg/dL', ucum: 'mg/dL'  },
  'Kalp Yetmezliği':         { code: '89765-0', display: 'Dispne Skoru',         unit: 'score', ucum: '{score}' },
  'KOAH':                     { code: '59408-5', display: 'Oksijen Satürasyonu',  unit: '%',    ucum: '%'       },
  'Astım':                    { code: '19935-6', display: 'Tepe Akış Ölçümü',    unit: 'L/min', ucum: 'L/min'  },
  'Kronik Böbrek Hastalığı':  { code: '2160-0', display: 'Kreatinin',            unit: 'mg/dL', ucum: 'mg/dL'  },
  'Epilepsi':                 { code: '89768-4', display: 'Nöbet Sayısı',         unit: 'count', ucum: '{count}'},
  'Parkinson':                { code: '89769-2', display: 'Tremor Skoru',         unit: 'score', ucum: '{score}'},
};

/**
 * Hasta yanıtını FHIR Observation'a dönüştür
 */
export function buildFHIRObservation(params: {
  tcKimlik: string;
  disease:  string;
  value:    number;
  date:     Date;
  threshold: number;
}): FHIRObservation {
  const loinc = DISEASE_LOINC[params.disease] ?? { code: '9999-9', display: params.disease, unit: 'unit', ucum: '{unit}' };
  const isHigh = params.value > params.threshold;

  return {
    resourceType: 'Observation',
    status: 'final',
    code: {
      coding: [{ system: 'http://loinc.org', code: loinc.code, display: loinc.display }],
      text: loinc.display,
    },
    subject: { reference: `Patient/${params.tcKimlik}` },
    effectiveDateTime: params.date.toISOString(),
    valueQuantity: {
      value: params.value,
      unit:  loinc.unit,
      system: 'http://unitsofmeasure.org',
      code:  loinc.ucum,
    },
    interpretation: [{
      coding: [{
        system:  'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
        code:    isHigh ? 'H' : 'N',
        display: isHigh ? 'High' : 'Normal',
      }],
    }],
  };
}

/**
 * e-Nabız'a Observation gönder (MOCK)
 * Prod'da real OAuth2 token alınır ve POST /Observation yapılır
 */
export async function sendToENabiz(observation: FHIRObservation): Promise<{
  success: boolean;
  fhirId?: string;
  error?: string;
}> {
  // MOCK mod — gerçek entegrasyon için ENABIZ_API_URL env değişkenini ayarlayın
  if (!process.env.ENABIZ_API_URL || process.env.ENABIZ_API_URL.includes('mock')) {
    // Simülasyon: %95 başarı
    const success = Math.random() > 0.05;
    await new Promise(r => setTimeout(r, 120)); // API gecikme simülasyonu
    return success
      ? { success: true, fhirId: `obs-${Date.now()}` }
      : { success: false, error: 'e-Nabız bağlantı zaman aşımı (simülasyon)' };
  }

  try {
    const res = await fetch(`${ENABIZ_BASE_URL}/Observation`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        'Authorization': `Bearer ${ENABIZ_CLIENT_ID}:${ENABIZ_SECRET}`,
        'X-Hospital-Code': process.env.HOSPITAL_CODE || 'TR-000000',
      },
      body: JSON.stringify(observation),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }

    const data = await res.json();
    return { success: true, fhirId: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
