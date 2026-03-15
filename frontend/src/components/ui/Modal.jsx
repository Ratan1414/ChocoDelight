import React from 'react';

export default function Modal({ isOpen, title, children, onClose, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-chocolate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-chocolate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-chocolate-500 hover:text-chocolate-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-chocolate-200"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="border-t border-chocolate-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
