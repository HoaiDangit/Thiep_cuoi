import { NextResponse } from 'next/server';
import { authConfig,setSession,authError } from '@/lib/auth';
import { authCall,credentials,verifyOrigin } from '@/lib/auth-core';
export async function POST(r:Request){try{verifyOrigin(r);const body=credentials(await r.json());const d=await authCall(authConfig(),'/signup',body);if(d?.access_token)return setSession(r,d);return NextResponse.json({confirmEmail:true,message:'Nếu email có thể đăng ký, bạn sẽ nhận được thư xác nhận. Xác nhận email rồi quay lại đăng nhập.'},{headers:{'Cache-Control':'private, no-store'}});}catch(e){return authError(e);}}
