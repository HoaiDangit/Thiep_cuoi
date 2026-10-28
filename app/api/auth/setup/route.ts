import { setupAdmin,authError } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);return await setupAdmin(r,await r.json());}catch(e){return authError(e,'setup');}}
