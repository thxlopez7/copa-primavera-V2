import { supabase } from './supabase';

// --- AUTH ---
export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// --- DB ---

// Categorías
export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
  if (error) console.error("Error fetching categories:", error);
  return data || [];
}

export async function addCategory(name, numPairs = 6) {
  const { data, error } = await supabase.from('categories').insert([{ name, num_pairs: numPairs }]).select();
  if (error) console.error("Error adding category:", error);
  return data ? data[0] : null;
}

export async function deleteCategory(id) {
  // Primero borramos los partidos y jugadores para evitar errores de llave foránea (si no hay CASCADE)
  await supabase.from('matches').delete().eq('category_id', id);
  await supabase.from('players').delete().eq('category_id', id);
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) console.error("Error deleting category:", error);
  return !error;
}

// Canchas
export async function getCourts() {
  const { data, error } = await supabase.from('courts').select('*').order('created_at', { ascending: true });
  if (error) console.error("Error fetching courts:", error);
  return data || [];
}

export async function addCourt(name) {
  const { data, error } = await supabase.from('courts').insert([{ name }]).select();
  if (error) console.error("Error adding court:", error);
  return data ? data[0] : null;
}

export async function deleteCourt(id) {
  const { error } = await supabase.from('courts').delete().eq('id', id);
  if (error) console.error("Error deleting court:", error);
  return !error;
}

// Jugadores
export async function getPlayers() {
  const { data, error } = await supabase.from('players').select('*, categories(name)').order('created_at', { ascending: false });
  if (error) console.error("Error fetching players:", error);
  return data || [];
}

export async function addPlayer(playerData) {
  const { data, error } = await supabase.from('players').insert([playerData]).select();
  if (error) console.error("Error adding player:", error);
  return data ? data[0] : null;
}

export async function updatePlayer(id, playerData) {
  const { data, error } = await supabase.from('players').update(playerData).eq('id', id).select();
  if (error) console.error("Error updating player:", error);
  return data ? data[0] : null;
}

export async function deletePlayer(id) {
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) console.error("Error deleting player:", error);
  return !error;
}

// Partidos
export async function getMatches() {
  const { data, error } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).order('match_time', { ascending: true });
  if (error) console.error("Error fetching matches:", error);
  return data || [];
}

export async function saveGeneratedMatches(matchesArray) {
  const { data, error } = await supabase.from('matches').insert(matchesArray).select();
  if (error) console.error("Error saving generated matches:", error);
  return data || [];
}

export async function deleteMatchesByCategory(categoryId) {
  const { error } = await supabase.from('matches').delete().eq('category_id', categoryId);
  if (error) console.error("Error deleting old matches:", error);
  return !error;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
  if (error) console.error("Error updating category:", error);
  return data ? data[0] : null;
}
export async function updateMatch(id, updates) {
  const { data, error } = await supabase.from('matches').update(updates).eq('id', id).select();
  if (error) console.error("Error updating match:", error);
  return data ? data[0] : null;
}

export async function updatePlayerPayment(playerId, hasPaid) {
  const { data, error } = await supabase
    .from('players')
    .update({ has_paid: hasPaid })
    .eq('id', playerId)
    .select();
    
  if (error) {
    console.error("Error updating player payment:", error);
    return null;
  }
  return data[0];
}
