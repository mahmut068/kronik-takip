export default function DashboardLoading() {
  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <div className="skeleton" style={{ height: '28px', width: '180px', borderRadius: '8px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '260px', borderRadius: '6px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '96px', borderRadius: '14px' }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '18px', marginBottom: '22px' }}>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '260px', borderRadius: '14px' }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '14px' }} />)}
      </div>
    </div>
  );
}
