export const BRACKET_MAPS = {
  6: [ 'WA', 'BYE', 'WC', 'LB', 'WB', 'BYE', 'LC', 'LA' ],
  8: [ 'WA', 'LB', 'WC', 'LD', 'WB', 'LC', 'WD', 'LA' ],
  10: [ 'WA', 'BYE', 'WE', 'BYE', 'WC', 'BYE', 'LD', 'LB', 'WB', 'BYE', 'LE', 'LC', 'WD', 'BYE', 'LA', 'BYE' ],
  12: [ 'WA', 'BYE', 'WE', 'LF', 'WC', 'BYE', 'LD', 'LB', 'WB', 'BYE', 'WF', 'LC', 'WD', 'BYE', 'LE', 'LA' ],
  14: [ 'WA', 'BYE', 'WE', 'LF', 'WC', 'LD', 'WG', 'LB', 'WB', 'BYE', 'WF', 'LC', 'WD', 'LE', 'LG', 'LA' ],
  16: [ 'WA', 'LB', 'WE', 'LF', 'WC', 'LD', 'WG', 'LH', 'WB', 'LC', 'WF', 'LE', 'WD', 'LG', 'WH', 'LA' ],
  18: [ 'WA', 'BYE', 'LF', 'LH', 'WE', 'BYE', 'LB', 'BYE', 'WC', 'BYE', 'LD', 'BYE', 'WG', 'BYE', 'WI', 'BYE', 'WB', 'BYE', 'LI', 'LA', 'WF', 'BYE', 'LC', 'BYE', 'WD', 'BYE', 'LE', 'BYE', 'WH', 'BYE', 'LG', 'BYE' ],
  20: [ 'WA', 'BYE', 'LD', 'LF', 'WE', 'BYE', 'LB', 'BYE', 'WC', 'BYE', 'LH', 'LJ', 'WG', 'BYE', 'WI', 'BYE', 'WB', 'BYE', 'LE', 'LG', 'WF', 'BYE', 'LC', 'BYE', 'WD', 'BYE', 'LI', 'LA', 'WH', 'BYE', 'WJ', 'BYE' ],
  22: [ 'WA', 'BYE', 'LD', 'LF', 'WG', 'BYE', 'WK', 'LB', 'WC', 'BYE', 'LH', 'LJ', 'WE', 'BYE', 'WI', 'BYE', 'WB', 'BYE', 'LC', 'LE', 'WF', 'BYE', 'LG', 'LI', 'WD', 'BYE', 'LK', 'LA', 'WH', 'BYE', 'WJ', 'BYE' ],
  24: [ 'WA', 'BYE', 'LF', 'LH', 'WE', 'BYE', 'WI', 'LB', 'WC', 'BYE', 'LJ', 'LL', 'WG', 'BYE', 'WK', 'LD', 'WB', 'BYE', 'LG', 'LI', 'WF', 'BYE', 'WJ', 'LC', 'WD', 'BYE', 'LK', 'LA', 'WH', 'BYE', 'WL', 'LE' ],
  26: [ 'WA', 'BYE', 'LJ', 'LL', 'WE', 'BYE', 'WG', 'LB', 'WC', 'BYE', 'WI', 'LD', 'WK', 'LF', 'WM', 'LH', 'WB', 'BYE', 'LI', 'LK', 'WF', 'BYE', 'WH', 'LC', 'WD', 'BYE', 'LM', 'LA', 'WJ', 'LE', 'WL', 'LG' ],
  28: [ 'WA', 'BYE', 'LL', 'LN', 'WE', 'LB', 'WG', 'LD', 'WC', 'BYE', 'WI', 'LF', 'WK', 'LH', 'WM', 'LJ', 'WB', 'BYE', 'LM', 'LA', 'WF', 'LC', 'WH', 'LE', 'WD', 'BYE', 'WJ', 'LG', 'WL', 'LI', 'WN', 'LK' ],
  30: [ 'WA', 'BYE', 'LL', 'WE', 'WI', 'LH', 'LD', 'WM', 'WC', 'LN', 'LJ', 'WG', 'WK', 'LF', 'LB', 'WO', 'WB', 'BYE', 'LK', 'WF', 'WJ', 'LG', 'LC', 'WN', 'WD', 'LM', 'LI', 'WH', 'WL', 'LE', 'LA', 'LO' ],
  32: [ 'WA', 'LP', 'LL', 'WE', 'WI', 'LH', 'LD', 'WM', 'WC', 'LN', 'LJ', 'WG', 'WK', 'LF', 'LB', 'WO', 'WB', 'LO', 'LK', 'WF', 'WJ', 'LG', 'LC', 'WN', 'WD', 'LM', 'LI', 'WH', 'WL', 'LE', 'LA', 'WP' ]
};

export function getRoundNames(numRounds) {
  if (numRounds === 3) return ['Cuartos', 'Semis', 'Final']; 
  if (numRounds === 4) return ['Octavos', 'Cuartos', 'Semis', 'Final']; 
  if (numRounds === 5) return ['16avos', 'Octavos', 'Cuartos', 'Semis', 'Final']; 
  return ['Ronda 1', 'Ronda 2', 'Ronda 3', 'Ronda 4', 'Ronda 5'];
}

export function createEmptyScore() {
  return { p1: ['','',''], p2: ['','',''] };
}

export function generateTournamentMatches(categoryId, numPairs, pairsList, isRandom) {
  let pairs = [...pairsList];

  if (isRandom) {
    let realPairs = pairs.filter(p => p !== 'BYE');
    let byes = pairs.filter(p => p === 'BYE');

    for (let i = realPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [realPairs[i], realPairs[j]] = [realPairs[j], realPairs[i]];
    }

    pairs = [];
    let byeCount = byes.length;
    let expectedLength = pairsList.length;

    for (let i = 0; i < expectedLength; i++) {
      if (i % 2 === 1 && byeCount > 0) {
        pairs.push('BYE');
        byeCount--;
      } else if (realPairs.length > 0) {
        pairs.push(realPairs.shift());
      } else if (byeCount > 0) {
        pairs.push('BYE');
        byeCount--;
      }
    }
  }

  let generatedMatches = [];
  
  // 1. ZONAS
  let pairIndex = 0;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numZones = numPairs / 2;

  for(let i=0; i < numZones; i++) {
    let p1 = pairs[pairIndex++];
    let p2 = pairs[pairIndex++];
    let autoWinner = null;
    let isComplete = false;
    
    if (p1 === 'BYE' && p2 !== 'BYE') { autoWinner = p2; isComplete = true; }
    else if (p2 === 'BYE' && p1 !== 'BYE') { autoWinner = p1; isComplete = true; }
    else if (p1 === 'BYE' && p2 === 'BYE') { autoWinner = 'BYE'; isComplete = true; }

    generatedMatches.push({
      category_id: categoryId,
      match_type: 'ZONE',
      round_name: 'ZONA ' + alphabet[i],
      round_index: 0,
      match_index: i,
      p1_name: p1,
      p2_name: p2,
      winner: autoWinner,
      is_wo: isComplete,
      is_bye: p1 === 'BYE' || p2 === 'BYE'
    });
  }

  // 2. BRACKET (First Round)
  let mapTemplate = BRACKET_MAPS[numPairs];
  let numRounds = Math.log2(mapTemplate.length);
  let rNames = getRoundNames(numRounds);
  
  for(let i=0; i<mapTemplate.length; i+=2) {
    let p1Code = mapTemplate[i];
    let p2Code = mapTemplate[i+1];
    let mIndex = i / 2;
    let matchLetter = String.fromCharCode(65 + mIndex);
    let matchId = rNames[0] + ' ' + matchLetter;

    let formatSource = (code) => {
      if (!code || code === 'BYE') return 'BYE';
      if (code.startsWith('W')) return `Zona ${code.substring(1)} 1º`;
      if (code.startsWith('L')) return `Zona ${code.substring(1)} 2º`;
      return code;
    };

    generatedMatches.push({
      category_id: categoryId,
      match_type: 'BRACKET',
      round_name: matchId,
      round_index: 1, // 1 represents the first bracket round
      match_index: mIndex,
      p1_name: formatSource(p1Code), // We store the source as the initial name so it displays "Zona A 1º"
      p2_name: formatSource(p2Code),
      is_bye: p1Code === 'BYE' || p2Code === 'BYE'
    });
  }

  // Bracket subsequent rounds can be generated dynamically or pre-generated empty
  // Let's pre-generate them empty for simplicity
  let currentRoundCount = mapTemplate.length / 2;
  let rIndex = 2;
  
  while(currentRoundCount > 1) {
    currentRoundCount = currentRoundCount / 2;
    for(let i=0; i<currentRoundCount; i++) {
      let matchLetter = String.fromCharCode(65 + i);
      let matchId = rNames[rIndex-1] + ' ' + matchLetter;
      generatedMatches.push({
        category_id: categoryId,
        match_type: 'BRACKET',
        round_name: matchId,
        round_index: rIndex,
        match_index: i,
        p1_name: null,
        p2_name: null,
        is_bye: false
      });
    }
    rIndex++;
  }

  return { pairs, generatedMatches };
}

export function advanceWinner(matchesList, updatedMatch) {
  let updatesArray = [];

  // SI SE ACTUALIZÓ UNA ZONA
  if (updatedMatch.match_type === 'ZONE') {
    // Para una zona (ej. "ZONA A"), extraemos la letra "A"
    const zoneLetter = updatedMatch.round_name.replace('ZONA ', '').trim();
    const winnerLabel = `Zona ${zoneLetter} 1º`;
    const loserLabel = `Zona ${zoneLetter} 2º`;

    const winnerName = updatedMatch.winner;
    const loserName = updatedMatch.winner === updatedMatch.p1_name ? updatedMatch.p2_name : 
                      updatedMatch.winner === updatedMatch.p2_name ? updatedMatch.p1_name : null;

    if (!winnerName || !loserName) return [];

    // Buscar si hay partidos en el bracket que estén esperando a este ganador o perdedor
    matchesList.forEach(m => {
      if (m.match_type === 'BRACKET' && m.category_id === updatedMatch.category_id) {
        let matchUpdates = {};
        let needsUpdate = false;

        // Reemplazar Winner
        if (m.p1_name === winnerLabel) { matchUpdates.p1_name = winnerName; needsUpdate = true; }
        if (m.p2_name === winnerLabel) { matchUpdates.p2_name = winnerName; needsUpdate = true; }
        
        // Reemplazar Loser
        if (m.p1_name === loserLabel) { matchUpdates.p1_name = loserName; needsUpdate = true; }
        if (m.p2_name === loserLabel) { matchUpdates.p2_name = loserName; needsUpdate = true; }

        if (needsUpdate) {
          // Chequeo de Auto-BYE
          if (matchUpdates.p1_name && m.p2_name === 'BYE') matchUpdates.winner = matchUpdates.p1_name;
          if (matchUpdates.p2_name && m.p1_name === 'BYE') matchUpdates.winner = matchUpdates.p2_name;
          
          updatesArray.push({ matchId: m.id, updates: matchUpdates });
        }
      }
    });

    return updatesArray;
  }

  // SI SE ACTUALIZÓ EL BRACKET
  if (updatedMatch.match_type === 'BRACKET') {
    const nextRoundIndex = updatedMatch.round_index + 1;
    const nextMatchIndex = Math.floor(updatedMatch.match_index / 2);
    const isTop = updatedMatch.match_index % 2 === 0;

    const nextMatch = matchesList.find(m => m.category_id === updatedMatch.category_id && m.match_type === 'BRACKET' && m.round_index === nextRoundIndex && m.match_index === nextMatchIndex);
    
    if (!nextMatch) return []; // No hay siguiente partido (ej. Final)

    let matchUpdates = {};
    if (isTop) {
      matchUpdates.p1_name = updatedMatch.winner;
    } else {
      matchUpdates.p2_name = updatedMatch.winner;
    }

    // Auto-BYE
    if (matchUpdates.p1_name && nextMatch.p2_name === 'BYE') matchUpdates.winner = matchUpdates.p1_name;
    if (matchUpdates.p2_name && nextMatch.p1_name === 'BYE') matchUpdates.winner = matchUpdates.p2_name;

    return [{ matchId: nextMatch.id, updates: matchUpdates }];
  }

  return [];
}


