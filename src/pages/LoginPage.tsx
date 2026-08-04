import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { staffUsers } from '@/data/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 가상 로그인: 사번만 확인
    const staff = staffUsers.find((s) => s.employeeId === employeeId);
    if (staff && password.length > 0) {
      localStorage.setItem('currentStaff', JSON.stringify(staff));
      navigate('/dashboard');
    } else {
      setError('사번 또는 비밀번호를 확인해주세요. (테스트: EMP2024001 / 아무 비밀번호)');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '48px 40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏥</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            병원길잡이
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            병원길잡이 이용을 위한 로그인이 필요합니다.
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              label="사번"
              placeholder="사번을 입력하세요"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                color: '#dc2626',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg">
            로그인
          </Button>
        </form>

        {/* 테스트 계정 안내 및 회원가입 */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          <strong>테스트 계정</strong>
          <br />
          사번: EMP2024001 | 비밀번호: 아무 값 입력
          <div style={{ marginTop: '12px' }}>
            <Button variant="outline" size="sm" onClick={() => alert('회원가입 페이지는 준비 중입니다.')}>
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
