'use client';

import Link from 'next/link';
import { Activity, ShieldCheck, BrainCircuit, Stethoscope, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* ── Background Animations & Gradients ── */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(2, 6, 23, 0) 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(2, 6, 23, 0) 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
          100% { box-shadow: 0 0 35px rgba(56, 189, 248, 0.8); }
        }
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          border-color: rgba(56, 189, 248, 0.3);
        }
        .cta-btn {
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: white;
          padding: 16px 36px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          animation: pulseGlow 2s infinite alternate;
        }
        .cta-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #38bdf8, #818cf8);
        }
      `}} />

      {/* ── Main Content Container ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Navbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>SentryHealth</span>
          </div>
          <Link href="/login" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Giriş Yap
          </Link>
        </header>

        {/* Hero Section */}
        <main style={{ textAlign: 'center', marginTop: '120px', marginBottom: '120px' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '999px', fontWeight: 700, fontSize: '13px', marginBottom: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            Yapay Zeka Destekli Erken Uyarı Sistemi
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: '1.1', letterSpacing: '-2px', marginBottom: '24px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sağlıkta Geleceği <br/> Bugünden Yönetin
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
            Kronik hastalarınızı gerçek zamanlı takip edin, klinik riskleri yapay zeka ile önceden tahmin edin ve hayat kurtaran müdahalelerde bulunun.
          </p>
          <Link href="/login" className="cta-btn">
            Sisteme Giriş Yap <ChevronRight size={22} />
          </Link>
        </main>

        {/* Features Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', paddingBottom: '120px' }}>
          
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <BrainCircuit size={28} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>Klinik Zeka Algoritması</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '15px' }}>
              Milyonlarca sensör verisini anlık analiz ederek, hastanın durumunun kritik seviyeye ulaşmadan önce sizi uyarmasını sağlar.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Stethoscope size={28} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>Kusursuz Hasta Takibi</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '15px' }}>
              Recharts destekli interaktif widgetlar ile her hastanın medikal geçmişini, anlık sensör değerlerini tek ekranda izleyin.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={28} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>Uçtan Uca Güvenlik (KVKK)</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '15px' }}>
              Banka standartlarında Zero-Trust mimarisi. SGK Medula entegrasyonu ile verileriniz tamamen kapalı devre korunur.
            </p>
          </div>

        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '14px' }}>
          <div>© 2026 SentryHealth Inc. Tüm Hakları Saklıdır.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Sağlık Bakanlığı Onaylı Sistem</span>
            <span>Versiyon 1.0</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
