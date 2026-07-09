import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.klinikzeka.kronik',
  appName: 'Klinik Zeka',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000', // Production için: 'https://klinikzeka.gov.tr'
    cleartext: true
  }
};

export default config;
