import {onRequest} from "firebase-functions/v2/https";
import {SupabaseClient} from "../shared/client/supabase-client";
const cors = require('cors')({origin: true});

export const getDrinks = onRequest(async (req, res) => {
    cors(req, res, async () => {
        const supabaseClient = new SupabaseClient().client();
        const response = await supabaseClient
            .from('drinks')
            .select('*');
        res.json(response.data);
    })
});