// Bu route group artık kullanılmıyor. 
// Tüm dashboard sayfaları /dashboard/ altında tanımlıdır.
// Bu dosya sadece çakışmayı önlemek için mevcuttur.
import React from 'react';
export default function OldGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
