import { authConfig,setSession,authError } from '@/lib/auth';
import { authCall,credentials,verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const body=credentials(await r.json());return setSession(r,await authCall(authConfig(),'/token?grant_type=password',body));}catch(e){return authError(e);}}
