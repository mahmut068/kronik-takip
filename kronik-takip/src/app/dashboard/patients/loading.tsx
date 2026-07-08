export default function PatientsLoading() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
        <div>
          <div className="skeleton" style={{ height: '26px', width: '140px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ height: '13px', width: '180px', borderRadius: '6px' }} />
        </div>
        <div className="skeleton" style={{ height: '40px', width: '130px', borderRadius: '10px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '12px' }} />)}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div className="skeleton" style={{ height: '42px', width: '280px', borderRadius: '10px' }} />
        <div className="skeleton" style={{ height: '42px', width: '200px', borderRadius: '10px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
        {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: '158px', borderRadius: '14px' }} />)}
      </div>
    </div>
  );
}
