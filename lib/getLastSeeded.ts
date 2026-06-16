import { createClient } from '@supabase/supabase-js';

export async function getLastSeeded(): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('chunks')
    .select('date_updated')
    .order('date_updated', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  return data.date_updated;
}