import { checkAdminSetup,authError } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);return Response.json(await checkAdminSetup(r,await r.json()),{headers:{'Cache-Control':'private, no-store'}});}catch(e){return authError(e,'setup');}}
