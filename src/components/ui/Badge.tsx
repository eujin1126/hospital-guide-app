import React from 'react';

interface BadgeProps {
  status: 'success' | 'warning' | 'neutral' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, children }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    success: { bg: '#dcfce7', text: '#166534' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    neutral: { bg: '#f1f5f9', text: '#64748b' },
    info: { bg: '#dbeafe', text: '#1e40af' },
  };

  const { bg, text } = colors[status];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
      }}
    >
      {children}
    </span>
  );
};
