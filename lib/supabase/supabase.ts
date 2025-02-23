import { createClient } from "@supabase/supabase-js";

// Récupérer les variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier que les variables sont définies
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies.');
}

// Créer et exporter le client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
