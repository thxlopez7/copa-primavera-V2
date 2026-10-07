"use client";

import { useState } from "react";
import { updateMatch } from "../lib/supabaseService";

export default function BracketView({ category, allMatches, courts, mode, onBack, onMatchUpdate }) {
  const [editingMatch, setEditingMatch] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Filtrar partidos de esta categoría
  const matches = allMatches.filter(m => m.category_id === category.id);
  
  // Agrupar
  const zones = matches.filter(m => m.match_type === 'ZONE').sort((a, b) => a.match_index - b.match_index);
  const bracketMatches = matches.filter(m => m.match_type === 'BRACKET');
  
  // Agrupar bracket por rondas
  const bracketByRound = [];
  let maxRound = 0;
  bracketMatches.forEach(m => {
    if (m.round_index > maxRound) maxRound = m.round_index;
  });
  for(let i = 1; i <= maxRound; i++) {
    bracketByRound.push(bracketMatches.filter(m => m.round_index === i).sort((a, b) => a.match_index - b.match_index));
  }



  const MatchCard = ({ match }) => {
    const isByeMatch = match.is_bye;
    
    const p1Score = match.p1_score || ['','',''];
    const p2Score = match.p2_score || ['','',''];
    
    const isWOP1 = match.is_wo && match.winner === match.p1_name;
    const isWOP2 = match.is_wo && match.winner === match.p2_name;



    const p1IsWinner = match.winner && match.winner === match.p1_name;
    const p2IsWinner = match.winner && match.winner === match.p2_name;
    const hasWinner = match.winner && match.winner !== 'null';

    const p1Classes = `grid grid-cols-[1fr_28px_28px_28px] items-center h-[42px] transition-all relative ${
      p1IsWinner ? 'bg-cyan-900/20' : hasWinner ? 'opacity-40' : 'bg-gray-900'
    }`;
    const p2Classes = `grid grid-cols-[1fr_28px_28px_28px] items-center h-[42px] transition-all relative ${
      p2IsWinner ? 'bg-cyan-900/20' : hasWinner ? 'opacity-40' : 'bg-gray-900'
    }`;

    const scoreBoxClass = (isWinner, hasWinner) => 
      `border-l border-gray-800 text-center text-[0.8rem] flex items-center justify-center h-full transition-colors ${
        isWinner ? 'bg-cyan-500/20 text-cyan-400 font-black shadow-[inset_0_0_8px_rgba(0,242,254,0.2)]' : 
        hasWinner ? 'bg-gray-900/50 text-gray-500 font-medium' : 
        'bg-gray-800 text-gray-200 font-semibold'
      }`;

    const courtName = courts.find(c => c.id === match.court_id)?.name || 'Sin Asignar';
    const dateStr = match.match_date ? `${match.match_date.split('-').reverse().join('/')} ${match.match_time || ''}` : 'Fecha a definir';

    const isEditable = mode === 'admin' && !isByeMatch;

    return (
      <div 
        className={`bg-gray-950 border ${hasWinner ? 'border-gray-700' : 'border-gray-800'} rounded-lg my-4 relative z-10 overflow-hidden ${
          isEditable ? 'cursor-pointer hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all transform hover:-translate-y-1 duration-300 group' : ''
        } ${isByeMatch ? 'opacity-50 grayscale hover:opacity-75 transition-opacity' : ''}`}
        onClick={() => isEditable && setEditingMatch(match)}
      >
        {/* Glow de fondo si tiene ganador */}
        {hasWinner && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />}
        
        <div className={`text-[0.65rem] font-black tracking-widest uppercase px-4 py-1.5 flex justify-between items-center transition-colors ${
          hasWinner ? 'bg-gray-800 text-cyan-400 border-b border-gray-700' : 'bg-cyan-600 text-white border-b border-cyan-700'
        }`}>
          <span className="flex items-center gap-1.5">
            {hasWinner && <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            {match.round_name}
          </span>
          {isEditable && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-cyan-200">Editar</span>}
        </div>

        <div className={p1Classes}>
          {p1IsWinner && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]" />}
          <div className={`text-[0.75rem] px-4 truncate flex items-center h-full ${p1IsWinner ? 'text-white font-bold' : !match.p1_name ? 'text-gray-500 italic' : 'text-gray-300'}`}>
             {match.p1_name || 'Esperando...'}
          </div>
          <div className={scoreBoxClass(p1IsWinner, hasWinner)}>{isWOP1 ? 'W' : p1Score[0]}</div>
          <div className={scoreBoxClass(p1IsWinner, hasWinner)}>{isWOP1 ? 'O' : p1Score[1]}</div>
          <div className={scoreBoxClass(p1IsWinner, hasWinner)}>{p1Score[2]}</div>
        </div>

        <div className="h-[1px] w-full bg-gray-800/50" />

        <div className={p2Classes}>
          {p2IsWinner && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]" />}
          <div className={`text-[0.75rem] px-4 truncate flex items-center h-full ${p2IsWinner ? 'text-white font-bold' : !match.p2_name ? 'text-gray-500 italic' : 'text-gray-300'}`}>
             {match.p2_name || 'Esperando...'}
          </div>
          <div className={scoreBoxClass(p2IsWinner, hasWinner)}>{isWOP2 ? 'W' : p2Score[0]}</div>
          <div className={scoreBoxClass(p2IsWinner, hasWinner)}>{isWOP2 ? 'O' : p2Score[1]}</div>
          <div className={scoreBoxClass(p2IsWinner, hasWinner)}>{p2Score[2]}</div>
        </div>

        <div className="flex justify-between items-center text-[0.65rem] text-gray-500 font-medium px-4 py-2 bg-gray-900 border-t border-gray-800">
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5 truncate max-w-[50%]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {courtName}
          </span>
        </div>
      </div>
    );
  };

  const renderChampion = () => {
    const finalRound = bracketByRound[bracketByRound.length - 1];
    if (finalRound && finalRound.length > 0) {
      const finalMatch = finalRound[0];
      if (finalMatch.winner && finalMatch.winner !== 'BYE') {
        return (
          <div className="absolute right-0 top-1/2 transform translate-x-[105%] -translate-y-1/2 text-center animate-fade-up z-50">
             <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Campeones</div>
             <div className="border border-yellow-500/50 bg-gray-900 text-white font-black py-3 px-6 rounded-lg inline-block text-sm shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                 {finalMatch.winner}
             </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-4 flex-shrink-0 border-b border-gray-800 pb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors bg-gray-900 py-1.5 px-3 rounded border border-gray-700">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver
        </button>
        <div className="flex items-center gap-3">
          {mode === 'admin' && zones.length > 0 && (
            <button onClick={() => setShowSwapModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase tracking-widest transition-colors shadow-lg">
              Intercambiar Parejas
            </button>
          )}
          <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm">{category.name}</span>
        </div>
      </div>
      
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl flex-grow relative shadow-2xl overflow-x-auto custom-scrollbar" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="flex gap-12 p-8 items-center min-w-max">
          
          {/* ZONAS */}
          {zones.length > 0 && (
            <div className="flex flex-col justify-center gap-6 relative min-w-[280px]">
              {zones.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}

          {/* BRACKET */}
          {bracketByRound.map((round, rIndex) => (
            <div key={rIndex} className="flex flex-col justify-center gap-6 relative min-w-[280px]">
              {round.map(m => <MatchCard key={m.id} match={m} />)}
              {rIndex === bracketByRound.length - 1 && renderChampion()}
            </div>
          ))}

        </div>
      </div>

      {/* MATCH EDITOR MODAL */}
      {editingMatch && (
        <MatchEditorModal 
          match={editingMatch} 
          courts={courts} 
          onClose={() => setEditingMatch(null)} 
          onSave={async (updates) => {
            const updatedMatch = await updateMatch(editingMatch.id, updates);
            if (updatedMatch) {
              onMatchUpdate(updatedMatch);
              setEditingMatch(null);
            } else {
              alert("Error al guardar el partido en la base de datos.");
            }
          }} 
        />
      )}

      {/* SWAP PAIRS MODAL */}
      {showSwapModal && (
        <SwapPairsModal 
          zones={zones}
          onClose={() => setShowSwapModal(false)}
          onSwap={async (p1Info, p2Info) => {
            if (p1Info.matchId === p2Info.matchId) {
              const updates = {};
              updates[p1Info.slot] = p2Info.name;
              updates[p2Info.slot] = p1Info.name;
              const u = await updateMatch(p1Info.matchId, updates);
              if (u) onMatchUpdate(u);
            } else {
              const updates1 = {}; updates1[p1Info.slot] = p2Info.name;
              const updates2 = {}; updates2[p2Info.slot] = p1Info.name;
              const [u1, u2] = await Promise.all([
                updateMatch(p1Info.matchId, updates1),
                updateMatch(p2Info.matchId, updates2)
              ]);
              if (u1) onMatchUpdate(u1);
              setTimeout(() => { if (u2) onMatchUpdate(u2); }, 100);
            }
            setShowSwapModal(false);
          }}
        />
      )}
    </div>
  );
}

function MatchEditorModal({ match, courts, onClose, onSave }) {
  const safeArray = (arr) => Array.isArray(arr) ? arr : ['', '', ''];
  const [date, setDate] = useState(match.match_date || '');
  const [time, setTime] = useState(match.match_time || '');
  const [courtId, setCourtId] = useState(match.court_id || '');
  const [p1Score, setP1Score] = useState(safeArray(match.p1_score));
  const [p2Score, setP2Score] = useState(safeArray(match.p2_score));
  const [isWo, setIsWo] = useState(match.is_wo || false);
  const [winner, setWinner] = useState(match.winner || 'null');
  const [loading, setLoading] = useState(false);

  const [p1Name, setP1Name] = useState(match.p1_name || '');
  const [p2Name, setP2Name] = useState(match.p2_name || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      match_date: date || null,
      match_time: time || null,
      court_id: courtId || null,
      is_wo: isWo,
      winner: winner === 'null' ? null : winner,
      p1_score: p1Score,
      p2_score: p2Score,
      p1_name: p1Name || null,
      p2_name: p2Name || null
    });
    setLoading(false);
  };

  const updateScore = (playerIdx, setIdx, val) => {
    if (playerIdx === 1) {
      const newScore = [...p1Score];
      newScore[setIdx] = val;
      setP1Score(newScore);
    } else {
      const newScore = [...p2Score];
      newScore[setIdx] = val;
      setP2Score(newScore);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-950">
          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">{match.round_name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Fecha</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Hora</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Cancha</label>
              <select value={courtId} onChange={e => setCourtId(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none">
                <option value="">Sin Asignar</option>
                {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-[1fr_40px_40px_40px] gap-2 mb-2 text-[10px] text-gray-500 uppercase tracking-widest text-center">
              <div className="text-left">Pareja</div><div>S1</div><div>S2</div><div>S3</div>
            </div>
            
            <div className="grid grid-cols-[1fr_40px_40px_40px] gap-2 items-center mb-3">
              <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder="Pareja 1" className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white focus:border-cyan-500 outline-none" />
              <input type="number" min="0" value={p1Score[0]} onChange={e => updateScore(1, 0, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
              <input type="number" min="0" value={p1Score[1]} onChange={e => updateScore(1, 1, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
              <input type="number" min="0" value={p1Score[2]} onChange={e => updateScore(1, 2, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
            </div>
            
            <div className="grid grid-cols-[1fr_40px_40px_40px] gap-2 items-center">
              <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder="Pareja 2" className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white focus:border-cyan-500 outline-none" />
              <input type="number" min="0" value={p2Score[0]} onChange={e => updateScore(2, 0, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
              <input type="number" min="0" value={p2Score[1]} onChange={e => updateScore(2, 1, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
              <input type="number" min="0" value={p2Score[2]} onChange={e => updateScore(2, 2, e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-center text-sm text-white focus:border-cyan-500" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-4 gap-4 mt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isWo} onChange={e => setIsWo(e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500" />
              <span className="text-sm text-gray-300 font-medium">Ganador por W.O.</span>
            </label>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest whitespace-nowrap">Ganador:</label>
              <select value={winner} onChange={e => setWinner(e.target.value)} className="bg-gray-900 border border-gray-700 rounded p-2 text-xs text-cyan-400 font-bold focus:border-cyan-500 outline-none w-full sm:max-w-[150px] truncate">
                <option value="null">Sin definir</option>
                <option value={p1Name || match.p1_name}>{p1Name || match.p1_name}</option>
                <option value={p2Name || match.p2_name}>{p2Name || match.p2_name}</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-2 uppercase tracking-widest text-sm transition-colors shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] flex justify-center items-center gap-2">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Guardar Partido"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SwapPairsModal({ zones, onClose, onSwap }) {
  const allPairs = [];
  zones.forEach(z => {
    // Solo permitimos intercambiar parejas en partidos que aún no tienen ganador
    const hasWinner = z.winner && z.winner !== 'null';
    if (!hasWinner) {
      if (z.p1_name && z.p1_name !== 'BYE') allPairs.push({ name: z.p1_name, matchId: z.id, slot: 'p1_name', zone: z.round_name });
      if (z.p2_name && z.p2_name !== 'BYE') allPairs.push({ name: z.p2_name, matchId: z.id, slot: 'p2_name', zone: z.round_name });
    }
  });

  const [pair1, setPair1] = useState('');
  const [pair2, setPair2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pair1 || !pair2 || pair1 === pair2) return;
    setLoading(true);
    const p1Info = allPairs.find(p => p.name === pair1);
    const p2Info = allPairs.find(p => p.name === pair2);
    await onSwap(p1Info, p2Info);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-950">
          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">Intercambiar Parejas</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-gray-400 text-center mb-4">Selecciona dos parejas para intercambiar sus lugares en las zonas. Solo se muestran parejas de partidos sin jugar.</p>
          
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pareja A</label>
            <select value={pair1} onChange={e => setPair1(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none">
              <option value="">Seleccionar pareja...</option>
              {allPairs.map(p => <option key={`p1-${p.name}`} value={p.name}>{p.name} ({p.zone})</option>)}
            </select>
          </div>
          
          <div className="flex justify-center text-gray-500">
             <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pareja B</label>
            <select value={pair2} onChange={e => setPair2(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none">
              <option value="">Seleccionar pareja...</option>
              {allPairs.map(p => <option key={`p2-${p.name}`} value={p.name}>{p.name} ({p.zone})</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading || !pair1 || !pair2 || pair1 === pair2} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-6 uppercase tracking-widest text-sm transition-colors shadow-[0_0_15px_rgba(0,242,254,0.1)] flex justify-center items-center gap-2">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Confirmar Intercambio"}
          </button>
        </form>
      </div>
    </div>
  );
}
