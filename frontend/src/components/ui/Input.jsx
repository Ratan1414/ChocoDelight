import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-chocolate-700 mb-1 block">{label}</span>}
      <input
        className={`w-full rounded-xl border border-chocolate-200 bg-white px-4 py-2 text-chocolate-700 placeholder:text-chocolate-300 focus:border-chocolate-400 focus:ring-2 focus:ring-chocolate-200 outline-none transition ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
