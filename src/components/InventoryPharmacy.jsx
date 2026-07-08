import React, { useState } from 'react';
import { Package, AlertCircle, ArrowDownCircle, AlertTriangle, CheckCircle, Search, Edit2, Plus, ArrowRightLeft } from 'lucide-react';

const CATEGORIES = ['İlaç', 'Sarf Malzemesi', 'Serum/Sıvı', 'Cerrahi', 'Laboratuvar'];

const initialInventory = [
  { id: 1, name: 'Parol 500mg Tb', category: 'İlaç', stock: 1250, unit: 'Kutu', minLevel: 500, expiry: '2027-12-01', location: 'Merkez Eczane' },
  { id: 2, name: 'İzotonik Serum 500ml', category: 'Serum/Sıvı', stock: 120, unit: 'Adet', minLevel: 200, expiry: '2026-10-15', location: 'Depo A' },
  { id: 3, name: 'Steril Eldiven (L)', category: 'Sarf Malzemesi', stock: 3500, unit: 'Çift', minLevel: 1000, expiry: '2028-01-01', location: 'Depo B' },
  { id: 4, name: 'Adrenalin 1mg Ampul', category: 'İlaç', stock: 45, unit: 'Kutu', minLevel: 50, expiry: '2026-08-20', location: 'Acil Servis' },
  { id: 5, name: 'Bistüri Ucu No:11', category: 'Cerrahi', stock: 800, unit: 'Adet', minLevel: 300, expiry: '2029-05-05', location: 'Ameliyathane' },
  { id: 6, name: 'Kan Alma Tüpü (EDTA)', category: 'Laboratuvar', stock: 150, unit: 'Adet', minLevel: 500, expiry: '2026-09-30', location: 'Laboratuvar' },
];

const InventoryPharmacy = () => {
  const [items, setItems] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredItems = items.filter(i => {
    const matchCat = filterCategory === 'all' || i.category === filterCategory;
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const getStatus = (item) => {
    const isLow = item.stock <= item.minLevel;
    const daysToExpiry = (new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24);
    const isExpiring = daysToExpiry < 90; // 3 aydan az
    
    if (isLow && isExpiring) return { label: 'Kritik + SKT', color: 'var(--danger)', icon: <AlertTriangle size={16} /> };
    if (isLow) return { label: 'Kritik Stok', color: 'var(--warning)', icon: <ArrowDownCircle size={16} /> };
    if (isExpiring) return { label: 'SKT Yaklaşıyor', color: '#f97316', icon: <AlertCircle size={16} /> };
    return { label: 'Yeterli', color: 'var(--success)', icon: <CheckCircle size={16} /> };
  };

  const totalLow = items.filter(i => i.stock <= i.minLevel).length;
  const totalExpiring = items.filter(i => (new Date(i.expiry) - new Date()) / (1000 * 60 * 60 * 24) < 90).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Package size={32} color="var(--primary)" /> Stok & Eczane Yönetimi
          </h1>
          <p className="text-muted">Tıbbi malzeme ve ilaç stok durumu, kritik seviye uyarıları.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-button" style={{ padding: '10px 16px' }}>
            <ArrowRightLeft size={18} /> Transfer
          </button>
          <button className="glass-button primary" style={{ padding: '10px 16px' }}>
            <Plus size={18} /> Yeni Ürün
          </button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Toplam Kalem</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{items.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--warning)', background: totalLow > 0 ? 'rgba(234,179,8,0.05)' : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Kritik Seviyede Ürün</div>
            <ArrowDownCircle color="var(--warning)" size={20} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: totalLow > 0 ? 'var(--warning)' : 'var(--text-main)' }}>{totalLow}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--danger)', background: totalExpiring > 0 ? 'rgba(239,68,68,0.05)' : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>SKT Yaklaşan (&lt;90 Gün)</div>
            <AlertCircle color="var(--danger)" size={20} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: totalExpiring > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{totalExpiring}</div>
        </div>
      </div>

      {/* Filtre ve Arama */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Malzeme veya İlaç Ara..." 
            style={{ width: '100%', padding: '10px 14px 10px 42px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Outfit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '4px' }}>
          <button onClick={() => setFilterCategory('all')} style={{ padding: '6px 16px', border: 'none', background: filterCategory === 'all' ? 'var(--primary)' : 'transparent', color: filterCategory === 'all' ? '#fff' : 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Tümü
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCategory(c)} style={{ padding: '6px 16px', border: 'none', background: filterCategory === c ? 'var(--primary)' : 'transparent', color: filterCategory === c ? '#fff' : 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tablo */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>ÜRÜN ADI</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>KATEGORİ</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>STOK / MİN</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>LOKASYON</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>SKT</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>DURUM</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const status = getStatus(item);
              const fillPct = Math.min(100, (item.stock / (item.minLevel * 3)) * 100);
              
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.category}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: item.stock <= item.minLevel ? 'var(--warning)' : 'var(--text-main)' }}>{item.stock}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {item.minLevel} {item.unit}</span>
                    </div>
                    {/* Stok barı */}
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '80px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${fillPct}%`, background: item.stock <= item.minLevel ? 'var(--warning)' : 'var(--primary)' }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.location}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.expiry}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', background: `${status.color}15`, color: status.color, fontSize: '0.8rem', fontWeight: 600, width: 'fit-content' }}>
                      {status.icon} {status.label}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="glass-button" style={{ padding: '6px' }}><Edit2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Sonuç bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPharmacy;
