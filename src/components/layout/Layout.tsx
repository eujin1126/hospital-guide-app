import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  staffName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, staffName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateString = currentTime.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const navItems = [
    { path: '/dashboard', label: '대시보드' },
    { path: '/patients', label: '전체 환자 목록' },
    { path: '/calendar', label: '예약 캘린더' },
    { path: '/guides', label: '안내문 관리' },
    { path: '/print-today', label: '오늘 예약 환자' },
    { path: '/print-history', label: '출력 이력' },
    { path: '/settings', label: '설정' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '200px',
          backgroundColor: '#2a3547',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '16px',
          left: '16px',
          bottom: '16px',
          zIndex: 100,
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(99,140,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#4a7dff', fontWeight: 700 }}>
              +
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>병원길잡이</div>
              <div style={{ fontSize: '10px', color: '#8899aa' }}>병원 안내 및 예약 관리 시스템</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#5eead4', fontVariantNumeric: 'tabular-nums' }}>
              {timeString}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#8899aa', marginTop: '4px' }}>
            {dateString}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? '#4a7dff' : 'transparent',
                  color: isActive ? '#fff' : '#a0aec0',
                  marginBottom: '2px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {staffName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4a7dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                {staffName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{staffName}</div>
                <div style={{ fontSize: '10px', color: '#8899aa' }}>간호사</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#a0aec0', fontSize: '12px', cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '232px', padding: '32px 36px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};
