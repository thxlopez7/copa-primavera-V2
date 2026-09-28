"use client";

import { useState } from "react";
import { updatePlayerPayment } from "../lib/supabaseService";

export default function AdminPayments({ players, categories, onBack, onPlayersUpdate, showToast }) {
  const [selectedCatId, setSelectedCatId] = useState("all");

  const handleTogglePayment = async (player) => {
    const newStatus = !player.has_paid;
    const updatedPlayer = await updatePlayerPayment(player.id, newStatus);
    if (updatedPlayer) {
      onPlayersUpdate(updatedPlayer, "update");
    } else {
      showToast("Aviso: Debes crear la columna 'has_paid' BOOLEAN en la tabla 'players' en Supabase para guardar pagos permanentemente.");
      // Actualizamos localmente para que puedan seguir probando
      onPlayersUpdate({...player, has_paid: newStatus}, "update");
    }
  };

  const filteredPlayers = selectedCatId === "all" 
    ? players 
    : players.filter(p => p.category_id === selectedCatId);

  const paidCount = filteredPlayers.filter(p => p.has_paid).length;
  const totalCount = filteredPlayers.length;

  return (
    <div className="animate-fade-up max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white text-xs flex items-center gap-2 transition-colors bg-gray-900 py-2 px-4 rounded border border-gray-800 uppercase tracking-widest font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver
          </button>
          <h2 className="text-2xl font-light text-white">Control de <span className="font-bold text-emerald-400">Pagos e Inscripciones</span></h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR: Filtros por Categoria */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Seleccionar Categoría</h3>
          <button 
            onClick={() => setSelectedCatId("all")}
            className={`text-left px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${selectedCatId === "all" ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-md' : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'}`}
          >
            Vista General
          </button>
          {categories.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`text-left px-4 py-3 rounded-xl border transition-all text-sm font-semibold flex justify-between items-center ${selectedCatId === c.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-md' : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'}`}
            >
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col h-fit">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
             <div>
               <h3 className="text-lg font-bold text-white">
                 {selectedCatId === "all" ? "Todos los inscriptos" : categories.find(c=>c.id===selectedCatId)?.name}
               </h3>
               <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Aprobación de estado de cuenta</p>
             </div>
             
             <div className="flex items-center gap-4 bg-gray-950 border border-gray-800 px-4 py-2 rounded-xl">
                <div className="text-center">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Inscriptos</p>
                   <p className="text-lg font-bold text-white">{totalCount}</p>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">
                   <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Abonaron</p>
                   <p className="text-lg font-bold text-emerald-400">{paidCount}</p>
                </div>
             </div>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
            {filteredPlayers.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-800 rounded-lg">No hay jugadores para mostrar.</div>
            ) : (
              filteredPlayers.map(p => {
                const catName = categories.find(c => c.id === p.category_id)?.name || p.categories?.name || 'Sin categoría';
                return (
                  <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-950 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                      <div className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold uppercase transition-colors ${p.has_paid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white break-words">{p.name} {p.partner ? `& ${p.partner}` : ''}</div>
                        {selectedCatId === "all" && <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 truncate">{catName}</div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end w-full sm:w-auto gap-4">
                      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${p.has_paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {p.has_paid ? 'Abonado' : 'Pendiente'}
                      </span>
                      <button 
                        onClick={() => handleTogglePayment(p)}
                        className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.has_paid ? 'bg-emerald-500' : 'bg-gray-700'}`}
                        title={p.has_paid ? "Marcar como impago" : "Marcar como pagado"}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.has_paid ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
