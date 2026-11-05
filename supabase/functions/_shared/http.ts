import {createClient} from 'npm:@supabase/supabase-js@2';
export const admin=()=>createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
export const cors={'Access-Control-Allow-Origin':Deno.env.get('APP_ORIGIN')??'http://localhost:5173','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
export const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
export async function authenticate(req:Request){const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token)throw Error('Please log in');const {data,error}=await admin().auth.getUser(token);if(error||!data.user)throw Error('Session expired. Please log in again.');return data.user;}
