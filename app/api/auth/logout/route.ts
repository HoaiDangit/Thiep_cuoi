import { cookies } from 'next/headers';
import { revokeSession,clearSession,authError,ACCESS_COOKIE,REFRESH_COOKIE } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const jar=await cookies();await revokeSession(jar.get(ACCESS_COOKIE)?.value);await revokeSession(jar.get(REFRESH_COOKIE)?.value);return clearSession();}catch(e){return authError(e);}}
