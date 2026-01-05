
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-8 py-6 border-t bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
