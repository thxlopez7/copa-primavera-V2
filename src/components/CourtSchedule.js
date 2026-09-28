"use client";

export default function CourtSchedule({ court, matches, categories, onBack }) {
  // Filtrar los partidos que corresponden a esta cancha, que no sean "BYE", y ordenarlos por fecha y hora
  const courtMatches = matches
    .filter(m => m.court_id === court.id && !m.is_bye)
    .sort((a, b) => {
      let da = new Date((a.match_date || '2099-01-01') + 'T' + (a.match_time || '00:00'));
      let db = new Date((b.match_date || '2099-01-01') + 'T' + (b.match_time || '00:00'));
      return da - db;
    });

  return (
    <div className="animate-fade-up max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white text-xs flex items-center gap-2 transition-colors bg-gray-900 py-2 px-4 rounded border border-gray-800 uppercase tracking-widest font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver al Panel
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-light text-white mb-6 border-b border-gray-800 pb-3">
          Partidos en <span className="font-bold text-cyan-400">{court.name}</span>
        </h2>
        
        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {courtMatches.length === 0 ? (
            <p className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-800 rounded-lg">No hay partidos programados en esta cancha.</p>
          ) : (
            courtMatches.map(m => {
              const catName = categories.find(c => c.id === m.category_id)?.name || 'Categoría Desconocida';
              const p1Score = m.p1_score || ['','',''];
              const p2Score = m.p2_score || ['','',''];
              const isWOP1 = m.is_wo && m.winner === m.p1_name;
              const isWOP2 = m.is_wo && m.winner === m.p2_name;
              
              const isP1Winner = m.winner === m.p1_name && m.p1_name;
              const isP2Winner = m.winner === m.p2_name && m.p2_name;

              const dateStr = m.match_date ? `${m.match_date.split('-').reverse().join('/')}` : 'Fecha a definir';
              const timeStr = m.match_time || '';

              return (
                <div key={m.id} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                  <div className="bg-gray-800/50 text-gray-300 text-[10px] font-bold tracking-wider uppercase px-4 py-2 flex justify-between border-b border-gray-800">
                    <span>{m.round_name} - {catName}</span>
                    <span className="text-cyan-500">{dateStr} {timeStr}</span>
                  </div>
                  <div className={`grid grid-cols-[1fr_30px_30px_30px] items-center h-10 border-b border-gray-800 ${isP1Winner ? 'bg-white/5 font-bold text-white' : 'text-gray-300'}`}>
                    <div className="px-4 truncate text-xs">{m.p1_name || <span className="italic opacity-50">Esperando...</span>}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{isWOP1 ? 'W' : p1Score[0]}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{isWOP1 ? 'O' : p1Score[1]}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{p1Score[2]}</div>
                  </div>
                  <div className={`grid grid-cols-[1fr_30px_30px_30px] items-center h-10 ${isP2Winner ? 'bg-white/5 font-bold text-white' : 'text-gray-300'}`}>
                    <div className="px-4 truncate text-xs">{m.p2_name || <span className="italic opacity-50">Esperando...</span>}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{isWOP2 ? 'W' : p2Score[0]}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{isWOP2 ? 'O' : p2Score[1]}</div>
                    <div className="border-l border-gray-800 text-center text-xs flex items-center justify-center h-full bg-gray-900">{p2Score[2]}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
