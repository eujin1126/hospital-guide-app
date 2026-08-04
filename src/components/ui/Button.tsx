import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    opacity: props.disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#4a7dff', color: '#fff' },
    secondary: { backgroundColor: '#f1f5f9', color: '#334155' },
    outline: { backgroundColor: 'transparent', color: '#4a7dff', border: '1px solid #4a7dff' },
    danger: { backgroundColor: '#ef4444', color: '#fff' },
    ghost: { backgroundColor: 'transparent', color: '#64748b' },
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...sizes[size] }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
