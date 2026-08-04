import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  fullWidth = false,
  style,
  ...props
}) => {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          boxSizing: 'border-box',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#2563eb';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
        {...props}
      />
    </div>
  );
};
