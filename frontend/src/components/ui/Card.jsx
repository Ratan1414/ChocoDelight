import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white shadow-sm border border-chocolate-100 rounded-2xl overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
