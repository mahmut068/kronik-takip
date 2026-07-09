import { redirect } from 'next/navigation';

// Kök URL'ye gelenler login sayfasına yönlendirilir.
// Başarılı girişten sonra /dashboard'a yönlendirilir.
export default function Home() {
  redirect('/login');
}
