const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const CLIENT_ID = Deno.env.get("CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");

export { CLIENT_ID, CLIENT_SECRET, SUPABASE_ANON_KEY };
