import { cookies } from 'next/headers';
import { authConfig,setSession,clearSession,authError,REFRESH_COOKIE } from '@/lib/auth';
import { authCall,AuthProblem,verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const token=(await cookies()).get(REFRESH_COOKIE)?.value;if(!token)return clearSession();try{return setSession(r,await authCall(authConfig(),'/token?grant_type=refresh_token',{refresh_token:token}));}catch(e){if(e instanceof AuthProblem&&e.status!==503&&e.status!==429)return clearSession();throw e;}}catch(e){return authError(e);}}
