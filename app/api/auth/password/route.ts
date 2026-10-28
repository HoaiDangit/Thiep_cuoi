import { changeAdminPassword,authError } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);return await changeAdminPassword(r,await r.json());}catch(e){return authError(e,'password');}}
