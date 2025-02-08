// Client exports
export { createClient as createClientBrowser } from "./client";

// Server exports
export { createClient as createClientServer } from "./server";

// Middleware exports
export { updateSession } from "./middleware";

// Types
export type { SupabaseClient } from "@supabase/supabase-js";
