import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = '24px',
  style,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
