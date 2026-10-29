import { loginAdmin,authError } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const body:any=await r.json();return await loginAdmin(r,body?.password,body?.username);}catch(e){return authError(e);}}
