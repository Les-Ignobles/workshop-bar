import { createClient } from '@supabase/supabase-js'
import {SUPABASE_DB_ANON_KEY, SUPABASE_DB_URL} from "../constants";

export class SupabaseClient {
    client() {
        return createClient(SUPABASE_DB_URL, SUPABASE_DB_ANON_KEY)
    }
}