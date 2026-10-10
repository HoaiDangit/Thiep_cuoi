import { cookies } from 'next/headers';
import { authConfig,clearSession,authError,ACCESS_COOKIE } from '@/lib/auth';
import { authCall,verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const token=(await cookies()).get(ACCESS_COOKIE)?.value;if(token){try{await authCall(authConfig(),'/logout?scope=local',{},token);}catch{}}return clearSession();}catch(e){return authError(e);}}
