"use client";

import { useState } from "react";

export function PromptModal({ title, placeholder, onConfirm, onCancel }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onConfirm(value.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input 
            type="text" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white outline-none focus:border-cyan-500 transition-colors"
            placeholder={placeholder}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
              Cancelar
            </button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60] bg-gray-900 border border-cyan-500/50 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <p className="text-white text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
}
