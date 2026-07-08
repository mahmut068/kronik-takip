import React, { useState } from 'react';
import { AlertTriangle, X, Ambulance, MapPin, CheckCircle } from 'lucide-react';

const AlertModal = ({ patientName, message, onClose }) => {
  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const handleDispatch = () => {
    setAmbulanceDispatched(true);
    // Simulate finding ambulance and arriving
    setTimeout(() => {
      setDispatchSuccess(true);
    }, 3000);
  };

  return (
    <div className="alert-overlay animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="alert-modal animate-slide-in" style={{ padding: ambulanceDispatched ? '30px' : '40px', transition: 'all 0.5s ease' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: ambulanceDispatched ? '#fff' : 'var(--danger)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {!ambulanceDispatched ? (
          <>
            <div className="flex-center mb-4" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={64} className="animate-pulse-danger" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#fff' }}>ACİL DURUM!</h2>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>{patientName}</h3>
            <p style={{ fontSize: '1.1rem', color: '#fca5a5', marginBottom: '24px' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="glass-button" onClick={onClose}>Göz Ardı Et</button>
              <button 
                className="glass-button" 
                style={{ backgroundColor: '#fff', color: 'var(--danger)', fontWeight: 'bold' }}
                onClick={handleDispatch}
              >
                <Ambulance size={20} /> Ambulans Yönlendir
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            {!dispatchSuccess ? (
              <>
                <div className="radar-effect">
                  <Ambulance size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>Ambulans Yönlendiriliyor...</h2>
                <p style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <MapPin size={18} /> {patientName} konum bilgisi taranıyor.
                </p>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="flex-center mb-4">
                  <CheckCircle size={64} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--success)' }}>Ambulans Yolda!</h2>
                <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                  Hasta {patientName} için en yakın acil müdahale ekibi yola çıkmıştır. Tahmini varış: 4 Dakika.
                </p>
                <button className="glass-button primary" onClick={onClose} style={{ margin: '0 auto' }}>
                  Paneli Kapat
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AlertModal;
