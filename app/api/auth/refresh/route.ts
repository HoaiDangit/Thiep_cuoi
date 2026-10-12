import { cookies } from 'next/headers';
import { adminSession,setSession,clearSession,authError,REFRESH_COOKIE } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const token=(await cookies()).get(REFRESH_COOKIE)?.value;const session=await adminSession(token);return session&&token?setSession(r,token,session.expires):clearSession();}catch(e){return authError(e);}}
