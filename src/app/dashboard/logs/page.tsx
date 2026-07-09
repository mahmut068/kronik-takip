'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MessageSquare, CheckCircle, Clock, Phone,
  ChevronLeft, ChevronRight, RefreshCw, XCircle,
  Volume2, Filter,
} from 'lucide-react';

export default function LogsPage() {
  const [logs,    setLogs]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [channel, setChannel] = useState<'ALL' | 'SMS' | 'VOICE'>('ALL');

  const load = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/sms-logs?page=${p}&limit=30`)
      .then(r => r.json())
      .then(d => {
        setLogs(Array.isArray(d.logs) ? d.logs : []);
        setTotal(d.total ?? 0);
        setTotalPages(d.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const filtered = channel === 'ALL' ? logs : logs.filter(l => l.provider?.includes(channel === 'VOICE' ? 'voice' : 'netgsm'));
  const smsCount   = logs.filter(l => !l.provider?.includes('voice')).length;
  const voiceCount = logs.filter(l =>  l.provider?.includes('voice')).length;

  return (
    <div>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px', marginBottom: '4px' }}>SMS / Arama Logları</h1>
          <p style={{ fontSize: '13px', color: '#4d6b82' }}>Sisteme gönderilen tüm SMS ve yapay zeka araması kayıtları</p>
        </div>
        <button onClick={() => load(page)} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} />Yenile
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Toplam Gönderim', val: total,      color: '#00e5ff', dim: 'rgba(0,229,255,0.08)',   icon: MessageSquare },
          { label: 'SMS',             val: smsCount,   color: '#10b981', dim: 'rgba(16,185,129,0.08)', icon: CheckCircle   },
          { label: 'Sesli Arama',     val: voiceCount, color: '#a78bfa', dim: 'rgba(167,139,250,0.08)',icon: Volume2       },
        ].map(({ label, val, color, dim, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dim, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2f0f9', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '4px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['ALL', 'SMS', 'VOICE'] as const).map(c => (
          <button key={c} onClick={() => setChannel(c)} className="btn btn-sm"
            style={{ background: channel === c ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.04)', color: channel === c ? '#00e5ff' : '#8aafc7', border: `1px solid ${channel === c ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
            <Filter size={12} />{c === 'ALL' ? 'Tümü' : c === 'SMS' ? 'SMS' : 'Sesli Arama'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '10px' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <MessageSquare size={44} color="#4d6b82" style={{ marginBottom: '14px' }} />
          <div style={{ fontSize: '14px', color: '#4d6b82' }}>Henüz gönderim kaydı bulunmuyor.</div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Kanal</th>
                <th>Telefon</th>
                <th>Mesaj</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log: any) => {
                const isVoice   = log.provider?.includes('voice');
                const isSuccess = log.status === 'SENT';
                return (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isVoice ? 'rgba(167,139,250,0.1)' : 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isVoice ? <Volume2 size={14} color="#a78bfa" /> : <Phone size={14} color="#00e5ff" />}
                        </div>
                        <span style={{ fontSize: '11px', color: isVoice ? '#a78bfa' : '#00e5ff', fontWeight: 600 }}>{isVoice ? 'Sesli' : 'SMS'}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#e2f0f9' }}>{log.phone}</td>
                    <td style={{ color: '#8aafc7', maxWidth: '380px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>{log.message}</div>
                    </td>
                    <td>
                      {isSuccess
                        ? <div className="badge badge-success" style={{ fontSize: '10px' }}><CheckCircle size={9} />İletildi</div>
                        : <div className="badge badge-danger"  style={{ fontSize: '10px' }}><XCircle    size={9} />Başarısız</div>}
                    </td>
                    <td style={{ color: '#4d6b82', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={11} />
                        {log.sentAt ? new Date(log.sentAt).toLocaleString('tr-TR') : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">
            <ChevronLeft size={15} />Önceki
          </button>
          <span style={{ fontSize: '13px', color: '#8aafc7' }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm">
            Sonraki<ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
