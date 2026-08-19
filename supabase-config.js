const SUPABASE_URL =
  'https://dhicsuvsdnwkfvmfpdpg.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_laOPYcoWJYUVYoAVf3zr3A_j5cHXLe9';

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );