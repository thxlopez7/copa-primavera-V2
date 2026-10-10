"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getCategories, getCourts, getPlayers, getMatches, addCategory, deleteCategory, addCourt, deleteCourt, updateCategory, saveGeneratedMatches, deleteMatchesByCategory, updateMatch, getSession, logoutAdmin } from "../lib/supabaseService";
import { generateTournamentMatches, advanceWinner } from "../lib/tournamentLogic";
import BracketView from "./BracketView";
import AdminPlayers from "./AdminPlayers";
import CourtSchedule from "./CourtSchedule";
import AdminPayments from "./AdminPayments";
import AdminLogin from "./AdminLogin";
import { PromptModal, Toast } from "./UIComponents";




function AdminSetup({ category, players, onBack, onGenerate }) {
  const categoryPlayers = players.filter(p => p.category_id === category.id);
  const initialPairs = Array(category.num_pairs || 6).fill('');
  categoryPlayers.forEach((p, idx) => {
    if (idx < initialPairs.length) {
      initialPairs[idx] = `${p.name}${p.partner ? ' & ' + p.partner : ''}`;
    }
  });

  const [numPairs, setNumPairs] = useState(category.num_pairs || 6);
  const [pairs, setPairs] = useState(initialPairs);

  const handleNumPairsChange = (e) => {
    const newNum = parseInt(e.target.value);
    setNumPairs(newNum);
    const newPairs = [...pairs];
    while(newPairs.length < newNum) newPairs.push('');
    setPairs(newPairs.slice(0, newNum));
  };

  const handlePairChange = (index, val) => {
    const newPairs = [...pairs];
    newPairs[index] = val;
    setPairs(newPairs);
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto w-full mt-2">
      <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white text-xs bg-gray-900 py-1.5 px-3 rounded border border-gray-800">
        Volver al Panel
      </button>
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-800 pb-5 gap-4">
          <div>
            <h2 className="text-2xl font-light text-white">Inscripción <span className="font-bold text-cyan-400">{category.name}</span></h2>
            <p className="text-xs text-gray-400 mt-1">Si dejas espacios en blanco, se generarán "Pases Directos" (BYEs).</p>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Tamaño del Cuadro</label>
            <select value={numPairs} onChange={handleNumPairsChange} className="w-full bg-gray-950 border border-gray-800 text-white rounded p-2 focus:border-cyan-500 outline-none cursor-pointer text-sm font-mono">
              {[6,8,10,12,14,16,18,20,22,24,26,28,30,32].map(n => <option key={n} value={n}>{n} Parejas</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          {pairs.map((p, i) => (
            <div key={i} className="flex flex-col mb-3">
              <label className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-medium">
                Pareja {i+1} {i%2===0 ? '(ZONA ' + String.fromCharCode(65 + i/2) + ')' : ''}
              </label>
              <input 
                type="text" 
                value={p === 'BYE' ? '' : p} 
                onChange={(e) => handlePairChange(i, e.target.value)}
                placeholder="Dejar en blanco para generar BYE automático" 
                className="bg-gray-950 border border-gray-800 text-gray-200 rounded p-2 focus:border-cyan-500 outline-none text-sm w-full transition-colors"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Gestión del Cuadro de Eliminación</h3>
            {category.current_step === 'bracket' ? (
              <div className="bg-cyan-900/20 border border-cyan-800 rounded p-3 mb-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Cuadro Generado y Activo</span>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => onBack('view_bracket')} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-1.5 px-3 rounded font-bold transition-colors">
                     Ir al Cuadro
                   </button>
                   <button onClick={() => {
                     if(confirm('¿Estás seguro de que quieres borrar el cuadro entero? Perderás todos los resultados cargados.')) {
                        onBack('delete_bracket');
                     }
                   }} className="bg-red-900/40 hover:bg-red-900/80 text-red-400 border border-red-900/50 text-xs py-1.5 px-3 rounded font-bold transition-colors">
                     Borrar Cuadro
                   </button>
                 </div>
              </div>
            ) : (
              <div className="bg-gray-950 border border-gray-800 rounded p-3 mb-4">
                 <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Aún no se ha generado un cuadro para esta categoría.</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => onGenerate(numPairs, pairs, false)} className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest transition-colors">
              Generar (Orden Inscriptos)
            </button>
            <button onClick={() => onGenerate(numPairs, pairs, true)} className="w-full neon-button bg-cyan-500/10 font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest flex justify-center items-center gap-2">
              Generar Sorteo Aleatorio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TournamentApp({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [courts, setCourts] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [mode, setMode] = useState("public"); 
  const [view, setView] = useState("home");   
  const [activeCatId, setActiveCatId] = useState(null);
  const [activeCourtId, setActiveCourtId] = useState(null);
  const [session, setSession] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [promptConfig, setPromptConfig] = useState(null);
  const [expandedPair, setExpandedPair] = useState(null);
  const [publicPlayersCatId, setPublicPlayersCatId] = useState("all");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddCategory = () => {
    setPromptConfig({
      title: "Nueva Categoría",
      placeholder: "Ej: 7ma Caballeros",
      onConfirm: async (name) => {
        setPromptConfig(null);
        const newCat = await addCategory(name);
        if (newCat) {
          setCategories([...categories, newCat]);
          showToast("Categoría agregada exitosamente");
        }
      }
    });
  };

  const handleAddCourt = () => {
    setPromptConfig({
      title: "Agregar Cancha",
      placeholder: "Ej: Pilar Padel 1",
      onConfirm: async (name) => {
        setPromptConfig(null);
        const newCourt = await addCourt(name);
        if (newCourt) {
          setCourts([...courts, newCourt]);
          showToast("Cancha agregada exitosamente");
        }
      }
    });
  };

  const handleGenerateTournament = async (numPairs, pairs, isRandom) => {
    // Rellenamos los vacíos con 'BYE'
    const finalPairs = pairs.map(p => p.trim() || 'BYE');
    const { generatedMatches } = generateTournamentMatches(activeCatId, numPairs, finalPairs, isRandom);
    
    // Actualizamos la categoría
    await updateCategory(activeCatId, { num_pairs: numPairs, current_step: 'bracket' });
    setCategories(categories.map(c => c.id === activeCatId ? { ...c, num_pairs: numPairs, current_step: 'bracket' } : c));
    
    // Limpiamos los partidos viejos de la base de datos para esta categoría
    await deleteMatchesByCategory(activeCatId);
    // Guardamos los nuevos partidos en la DB
    await saveGeneratedMatches(generatedMatches);
    
    // Recargamos los partidos al estado local
    const fetchedMatches = await getMatches();
    setMatches(fetchedMatches);
    
    showToast("¡Sorteo generado con éxito!");
    setView("bracket");

  };

  useEffect(() => {
    const loadData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      if (currentSession) {
        setMode("admin");
        setView("admin_home");
      }
      
      const fetchedCourts = await getCourts();
      setCourts(fetchedCourts);
      const fetchedPlayers = await getPlayers();
      setPlayers(fetchedPlayers);
      const fetchedMatches = await getMatches();
      setMatches(fetchedMatches);
    };
    loadData();

    // Setup Supabase Realtime Subscriptions
    const channel = supabase.channel('tournament-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        getMatches().then(setMatches);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        getPlayers().then(setPlayers);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        getCategories().then(setCategories);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, () => {
        getCourts().then(setCourts);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMatchUpdate = async (updatedMatch) => {
    // 1. Actualizar estado local del partido editado
    let currentMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    setMatches([...currentMatches]);

    let queue = [updatedMatch];

    while (queue.length > 0) {
      const currentUpdate = queue.shift();
      // 2. Revisar si hay que avanzar al ganador a la siguiente ronda (propagarLlave)
      const propagations = advanceWinner(currentMatches, currentUpdate);
      
      if (propagations && propagations.length > 0) {
        for (const prop of propagations) {
          const advancedMatch = await updateMatch(prop.matchId, prop.updates);
          if (advancedMatch) {
             currentMatches = currentMatches.map(m => m.id === advancedMatch.id ? advancedMatch : m);
             
             // Si el partido cambió de ganador (establecido o revertido) o cambiaron sus participantes,
             // lo encolamos para que siga propagando o revirtiendo en cadena
             if (
               prop.updates.hasOwnProperty('winner') ||
               prop.updates.hasOwnProperty('p1_name') ||
               prop.updates.hasOwnProperty('p2_name')
             ) {
               queue.push(advancedMatch);
             }
          } else {
             console.error(`Error al persistir propagación en la base de datos para el partido: ${prop.matchId}`);
          }
        }
        setMatches([...currentMatches]);
      }
    }
  };

  const handlePlayersUpdate = (player, action) => {
    if (action === "add") setPlayers([...players, player]);
    if (action === "delete") setPlayers(players.filter(p => p.id !== player.id));
    if (action === "update") setPlayers(players.map(p => p.id === player.id ? player : p));
  };

  const handleDeleteCategory = async (id, name) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${name}"? Se borrarán todos los jugadores inscriptos y partidos. Esta acción es IRREVERSIBLE.`)) {
      const success = await deleteCategory(id);
      if (success) {
        setCategories(categories.filter(c => c.id !== id));
        showToast(`Categoría ${name} eliminada.`);
      } else {
        alert("Error al eliminar la categoría.");
      }
    }
  };

  const handleDeleteCourt = async (id, name) => {
    if (confirm(`¿Estás seguro de eliminar la cancha "${name}"?`)) {
      const success = await deleteCourt(id);
      if (success) {
        setCourts(courts.filter(c => c.id !== id));
        showToast(`Cancha ${name} eliminada.`);
      } else {
        alert("Error al eliminar la cancha.");
      }
    }
  };

  return (
    <>
      <header className="w-full bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3"
            onClick={() => { setMode("public"); setView("home"); }}
          >
            <h1 className="text-xl md:text-2xl font-title text-white tracking-widest">
              COPA <span className="text-cyan-400 font-bold">PRIMAVERA</span>
            </h1>
          </div>
          
          {mode === "public" && (
            <nav className="hidden md:flex gap-6">
              <a onClick={() => setView("home")} className={`text-sm font-semibold uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors ${view === "home" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400"}`}>
                Inicio & Torneo
              </a>
              <a onClick={() => setView("players")} className={`text-sm font-semibold uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors ${view === "players" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400"}`}>
                Jugadores
              </a>
            </nav>
          )}
          
          <div>
            {mode === "public" ? (
              <button 
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-1.5 px-4 rounded text-xs transition-colors border border-gray-700"
                onClick={() => {
                  if (session) {
                    setMode("admin");
                    setView("admin_home");
                  } else {
                    setView("admin_login");
                  }
                }}
              >
                Acceso Admin
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-1.5 px-4 rounded text-xs transition-colors border border-gray-700"
                  onClick={() => {
                    setMode("public");
                    setView("home");
                  }}
                >
                  Volver al Torneo
                </button>
                <button 
                  className="bg-red-900/40 hover:bg-red-900/80 text-red-400 font-semibold py-1.5 px-4 rounded text-xs transition-colors border border-red-900/50"
                  onClick={async () => {
                    await logoutAdmin();
                    setSession(null);
                    setMode("public");
                    setView("home");
                    showToast("Sesión cerrada");
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 py-8 pb-24 md:pb-8">
        
        {view === "admin_login" && (
          <AdminLogin 
            onLoginSuccess={async () => {
              const currentSession = await getSession();
              setSession(currentSession);
              setMode("admin");
              setView("admin_home");
              showToast("¡Bienvenido al panel!");
            }} 
            onCancel={() => setView("home")} 
          />
        )}
        {mode === "public" && view === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up">
            {/* Columna Izquierda */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-950/80 backdrop-blur-sm flex justify-center">
                <img src="/flyer.jpg" alt="Flyer Copa Primavera" className="w-full max-w-2xl h-auto object-contain" onError={(e) => { e.target.src = "https://placehold.co/800x400/0a192f/bfff00?text=COPA+PRIMAVERA+FLYER"; }} />
              </div>
              <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-title text-white mb-6 border-b border-gray-800 pb-3 uppercase tracking-wider">Selecciona tu <span className="font-bold text-cyan-400">Categoría</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500 italic col-span-full">No hay categorías disponibles aún.</p>
                  ) : (
                    categories.map(cat => (
                      <button key={cat.id} className="w-full text-left bg-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-cyan-500 rounded-xl p-5 transition-all shadow-md group" onClick={() => { setActiveCatId(cat.id); setView("bracket"); }}>
                        <h3 className="text-xl font-title font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{cat.name}</h3>
                        <p className="text-xs text-gray-500 mt-2 font-medium">{cat.current_step === "bracket" ? "Ver Cuadro y Resultados" : "Pendiente de Sorteo"}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="lg:col-span-4 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
              <h2 className="text-xl font-light text-white mb-6 border-b border-gray-800 pb-3">Calendario de <span className="font-bold text-cyan-400">Partidos</span></h2>
              <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                {courts.length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-10">Próximamente horarios de cada cancha...</p>
                ) : (
                  courts.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-gray-950 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                      <span className="text-sm font-bold text-gray-200">{c.name}</span>
                      <button 
                        onClick={() => { setActiveCourtId(c.id); setView("court_schedule"); }}
                        className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-bold transition-colors hover:bg-cyan-500 hover:text-gray-900"
                      >
                         Ver Partidos
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {mode === "public" && view === "players" && (
           <div className="animate-fade-up max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
              {/* Sidebar Categorías */}
              <div className="md:w-64 flex-shrink-0">
                 <h2 className="text-3xl font-title text-white mb-6 border-b border-gray-800 pb-4 uppercase tracking-widest">Jugadores <span className="font-bold text-cyan-400">Confirmados</span></h2>
                 
                 <div className="flex overflow-x-auto md:flex-col gap-3 pb-4 md:pb-0 custom-scrollbar">
                    <button
                       onClick={() => setPublicPlayersCatId("all")}
                       className={`whitespace-nowrap px-5 py-4 rounded-xl border text-sm font-bold transition-all shadow-lg text-left ${publicPlayersCatId === "all" ? "bg-cyan-500/10 border-cyan-400 text-cyan-400" : "bg-gray-950/80 backdrop-blur-md border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"}`}
                    >
                       TODAS LAS CATEGORÍAS
                    </button>
                    {categories.map(c => (
                       <button
                          key={c.id}
                          onClick={() => setPublicPlayersCatId(c.id)}
                          className={`whitespace-nowrap px-5 py-4 rounded-xl border text-sm font-bold transition-all shadow-lg text-left ${publicPlayersCatId === c.id ? "bg-cyan-500/10 border-cyan-400 text-cyan-400" : "bg-gray-950/80 backdrop-blur-md border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"}`}
                       >
                          {c.name.toUpperCase()}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Contenido Jugadores */}
              <div className="flex-1">
                {(() => {
                  const filteredPlayers = publicPlayersCatId === "all" ? players : players.filter(p => p.category_id === publicPlayersCatId);
                  
                  if (filteredPlayers.length === 0) {
                    return (
                      <div className="bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl text-center mt-4 md:mt-0">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No hay jugadores confirmados para esta selección.</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 md:mt-0">
                      {filteredPlayers.map(p => {
                        const catName = categories.find(c => c.id === p.category_id)?.name || p.categories?.name || 'Sin Categoría';
                        const isExpanded = expandedPair === p.id;
                        
                        return (
                          <div key={p.id} className="flex flex-col relative mb-4">
                            {isExpanded ? (
                              <div className="flex flex-col gap-2 animate-fade-up">
                                 <div className="bg-gray-950/80 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                                     <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-bold text-lg">{p.name.charAt(0)}</div>
                                     <div className="font-bold text-white text-base uppercase">{p.name}</div>
                                 </div>
                                 {p.partner && (
                                   <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 flex items-center gap-4 shadow-lg ml-6 relative">
                                       <div className="absolute -left-6 top-1/2 w-6 h-px bg-gray-700"></div>
                                       <div className="absolute -left-6 bottom-1/2 w-px h-[calc(50%+1rem)] bg-gray-700"></div>
                                       <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-400 font-bold">{p.partner.charAt(0)}</div>
                                       <div className="font-bold text-gray-300 text-sm uppercase">{p.partner}</div>
                                   </div>
                                 )}
                                 <button onClick={() => setExpandedPair(null)} className="text-[10px] text-gray-400 hover:text-cyan-400 mt-2 uppercase tracking-widest flex items-center gap-1 w-max">
                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                   Ocultar Pareja
                                 </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => setExpandedPair(p.id)}
                                className="relative cursor-pointer group h-28 w-full"
                              >
                                 {/* Background Card (Jugador 2) */}
                                 {p.partner && (
                                   <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl transition-all duration-300 group-hover:top-3 group-hover:left-3 shadow-md opacity-80 flex items-end justify-end p-3">
                                      <span className="text-gray-500 font-title text-sm tracking-widest uppercase truncate max-w-[150px]">{p.partner}</span>
                                   </div>
                                 )}
                                 {/* Foreground Card (Jugador 1 y Detalles) */}
                                 <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md border border-gray-700 rounded-xl flex flex-col justify-center p-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 shadow-xl">
                                     <h3 className="text-sm font-bold text-white uppercase truncate">{p.name}</h3>
                                     {p.partner && <h3 className="text-sm font-bold text-gray-400 uppercase truncate mt-0.5">& {p.partner}</h3>}
                                     
                                     <div className="mt-auto pt-3">
                                       <div className="inline-block bg-cyan-500/10 text-cyan-400 text-[9px] uppercase tracking-widest px-2 py-1 rounded border border-cyan-500/20 font-bold w-max">
                                         {catName}
                                       </div>
                                     </div>
                                 </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
           </div>
        )}

        {mode === "admin" && view === "admin_home" && (
          <div className="animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-800 pb-4 gap-4">
              <div>
                <h2 className="text-4xl font-title text-white uppercase tracking-widest">Panel de <span className="font-bold text-cyan-400">Administración</span></h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Dashboard General de Copa Primavera</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setView("admin_payments")} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-gray-900 font-semibold py-2 px-6 rounded-lg text-xs transition-colors shadow-md flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Inscripciones/Pagos
                </button>
                <button onClick={() => setView("admin_players")} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg text-xs transition-colors border border-gray-600 shadow-md flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Directorio de Jugadores
                </button>
              </div>
            </div>

            {/* ESTADISTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                 <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                 </div>
                 <div>
                   <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Total Jugadores</p>
                   <p className="text-2xl font-bold text-white">{players.length}</p>
                 </div>
               </div>
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                 <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 </div>
                 <div>
                   <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Categorías Activas</p>
                   <p className="text-2xl font-bold text-white">{categories.length}</p>
                 </div>
               </div>
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                 <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <div>
                   <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Canchas Habilitadas</p>
                   <p className="text-2xl font-bold text-white">{courts.length}</p>
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Categorias */}
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-white">Categorías del Torneo</h3>
                    <button className="bg-cyan-500 text-gray-900 hover:bg-cyan-400 font-bold py-1.5 px-3 rounded text-[10px] uppercase tracking-widest transition-colors shadow-lg" onClick={handleAddCategory}>
                      + Nueva Categoría
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 mb-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                    {categories.length === 0 && <p className="text-gray-500 text-sm italic">No hay categorías. Crea una nueva.</p>}
                    {categories.map(cat => (
                       <div key={cat.id} className="flex flex-col bg-gray-950 border border-gray-800 p-4 rounded-xl group hover:border-gray-700 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-white font-bold text-lg">{cat.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800 uppercase tracking-widest">{cat.num_pairs} Parejas</span>
                                {cat.current_step === 'bracket' && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-800 uppercase tracking-widest">Cuadro Activo</span>}
                              </div>
                            </div>
                            <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-gray-600 hover:text-red-400 p-1 transition-colors" title="Eliminar Categoría">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setActiveCatId(cat.id); setView("admin_setup"); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs py-2 rounded-lg border border-gray-700 transition-colors">Gestionar Cuadro</button>
                            <button 
                               onClick={() => { setActiveCatId(cat.id); setView("bracket"); }} 
                               className={`flex-1 font-semibold text-xs py-2 rounded-lg border transition-colors ${cat.current_step === 'bracket' ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-gray-900 text-gray-700 border-gray-800 cursor-not-allowed'}`} 
                               disabled={cat.current_step !== 'bracket'}
                            >
                               Ver Resultados
                            </button>
                          </div>
                       </div>
                    ))}
                  </div>
               </div>

               {/* Canchas */}
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col h-fit">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-white">Canchas Habilitadas</h3>
                    <button className="bg-emerald-500 text-gray-900 hover:bg-emerald-400 font-bold py-1.5 px-3 rounded text-[10px] uppercase tracking-widest transition-colors shadow-lg" onClick={handleAddCourt}>
                      + Agregar Cancha
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 mb-4 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                    {courts.length === 0 && <p className="text-gray-500 text-sm italic">No hay canchas registradas.</p>}
                    {courts.map(c => (
                       <div key={c.id} className="flex justify-between items-center bg-gray-950 border border-gray-800 p-4 rounded-xl group hover:border-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span className="text-white font-bold">{c.name}</span>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => { setActiveCourtId(c.id); setView("court_schedule"); }}
                               className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded text-xs font-bold transition-colors hover:bg-emerald-500 hover:text-gray-900"
                             >
                                Turnos
                             </button>
                             <button onClick={() => handleDeleteCourt(c.id, c.name)} className="bg-red-900/10 text-red-400 hover:bg-red-900/40 border border-red-900/20 p-1.5 rounded transition-colors" title="Eliminar Cancha">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                             </button>
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {mode === "admin" && view === "admin_players" && (
          <AdminPlayers 
            players={players} 
            categories={categories} 
            onBack={() => setView("admin_home")} 
            onPlayersUpdate={handlePlayersUpdate} 
            showToast={showToast}
          />
        )}

        {mode === "admin" && view === "admin_payments" && (
          <AdminPayments 
            players={players} 
            categories={categories} 
            onBack={() => setView("admin_home")} 
            onPlayersUpdate={handlePlayersUpdate} 
            showToast={showToast}
          />
        )}

        {mode === "admin" && view === "admin_setup" && (
          <AdminSetup 
            category={categories.find(c => c.id === activeCatId)} 
            players={players}
            onBack={async (action) => {
              if (action === 'view_bracket') {
                setView('bracket');
              } else if (action === 'delete_bracket') {
                await deleteMatchesByCategory(activeCatId);
                await updateCategory(activeCatId, { current_step: 'registration' });
                setCategories(categories.map(c => c.id === activeCatId ? { ...c, current_step: 'registration' } : c));
                const fetchedMatches = await getMatches();
                setMatches(fetchedMatches);
                showToast("Cuadro eliminado con éxito");
              } else {
                setView("admin_home");
              }
            }} 
            onGenerate={handleGenerateTournament} 
          />
        )}

        {view === "bracket" && activeCatId && (
          <BracketView 
            category={categories.find(c => c.id === activeCatId)}
            allMatches={matches}
            courts={courts}
            mode={mode}
            onBack={() => setView(mode === "admin" ? "admin_home" : "home")}
            onMatchUpdate={handleMatchUpdate}
          />
        )}

        {view === "court_schedule" && activeCourtId && (
          <CourtSchedule 
            court={courts.find(c => c.id === activeCourtId)}
            matches={matches}
            categories={categories}
            onBack={() => setView(mode === "admin" ? "admin_home" : "home")}
          />
        )}

        {mode === "public" && (
          <footer className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col items-center justify-center text-center gap-4">
            <div className="text-gray-500 text-xs font-medium tracking-wide">
              Diseñado y desarrollado con <span className="text-cyan-400">♥</span> por <span className="font-bold text-gray-300">Thiago Lopez</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/heythia_/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/thiago-lopez-284507219" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors" title="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
              </a>
            </div>
            <div className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
              Copa Primavera App v2.0
            </div>
          </footer>
        )}

      </main>

      {promptConfig && (
        <PromptModal 
          title={promptConfig.title}
          placeholder={promptConfig.placeholder}
          onConfirm={promptConfig.onConfirm}
          onCancel={() => setPromptConfig(null)}
        />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      {mode === "public" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-t border-gray-800 flex justify-around p-3 z-50">
           <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 transition-colors ${view === "home" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Torneo</span>
           </button>
           <button onClick={() => setView("players")} className={`flex flex-col items-center gap-1 transition-colors ${view === "players" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Jugadores</span>
           </button>
        </div>
      )}

    </>
  );
}
