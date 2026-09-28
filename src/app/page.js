import TournamentApp from "../components/TournamentApp";
import { getCategories } from "../lib/supabaseService";

// Forzamos que sea renderizado de forma dinámica si queremos que siempre traiga datos frescos,
// o podemos dejar que Next.js lo optimice (por defecto cacheará si no hay parámetros dinámicos).
export const revalidate = 0; // Desactiva la caché en desarrollo/producción para datos en tiempo real

export default async function Home() {
  const initialCategories = await getCategories();

  return (
    <TournamentApp initialCategories={initialCategories} />
  );
}
