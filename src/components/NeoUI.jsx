import React from 'react';

const styles = {
  button: {
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    fontWeight: '400',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#fff'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    backgroundColor: '#fff',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)'
  },
  th: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    textAlign: 'left',
    fontWeight: '600',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer'
  },
  td: {
    padding: '1rem',
    fontWeight: '500',
    borderBottom: '1px solid var(--border)'
  }
};

export const NeoButton = ({ children, variant = 'primary', onClick, style, type = 'button', disabled }) => {
  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      style={{ ...styles.button, opacity: disabled ? 0.6 : 1, ...style }}
      onMouseOver={(e) => {
        if(!disabled) e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
      }}
      onMouseOut={(e) => {
        if(!disabled) e.currentTarget.style.backgroundColor = 'var(--primary)';
      }}
    >
      {children}
    </button>
  );
};

export const NeoInput = ({ label, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
      {label && <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-color)' }}>{label}</label>}
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={styles.input}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
        }}
        {...props}
      />
    </div>
  );
};

export const NeoCard = ({ children, style, bgColor = '#fff', onClick }) => {
  return (
    <div className="neo-box" style={{ backgroundColor: bgColor, cursor: onClick ? 'pointer' : 'default', padding: 0, overflow: 'hidden', ...style }} onClick={onClick}>
      {children}
    </div>
  );
};

export const NeoTable = ({ columns, data, onSort }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={styles.th} onClick={() => onSort && col.sortable !== false && onSort(col.key)}>
                {col.label} {col.sortable !== false ? '↕' : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ ...styles.td, textAlign: 'center' }}>No data available</td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={styles.td}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
