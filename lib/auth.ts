import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { NextResponse } from 'next/server';
import { authCall,AuthProblem,readAuthConfig,validSession } from './auth-core';
export const ACCESS_COOKIE='loi_hen_access',REFRESH_COOKIE='loi_hen_refresh';
export function authConfig(){return readAuthConfig(env);}
export const getAuthUser=cache(async()=>{
 const token=(await cookies()).get(ACCESS_COOKIE)?.value;if(!token)return null;
 try{const data=await authCall(authConfig(),'/user',undefined,token);if(!data||typeof data.id!=='string'||typeof data.email!=='string')return null;return {userId:data.id,email:data.email,displayName:typeof data.user_metadata?.name==='string'?data.user_metadata.name:data.email};}
 catch(e){if(e instanceof AuthProblem&&e.status!==503)return null;throw e;}
});
export function setSession(r:Request,data:any){const s=validSession(data),res=NextResponse.json({signedIn:true},{headers:{'Cache-Control':'private, no-store'}});const secure=new URL(r.url).protocol==='https:';res.cookies.set(ACCESS_COOKIE,s.access,{httpOnly:true,secure,sameSite:'lax',path:'/',maxAge:s.seconds});res.cookies.set(REFRESH_COOKIE,s.refresh,{httpOnly:true,secure,sameSite:'lax',path:'/api/auth',maxAge:7*86400});return res;}
export function clearSession(){const res=NextResponse.json({signedIn:false},{headers:{'Cache-Control':'private, no-store'}});res.cookies.set(ACCESS_COOKIE,'',{httpOnly:true,sameSite:'lax',path:'/',maxAge:0});res.cookies.set(REFRESH_COOKIE,'',{httpOnly:true,sameSite:'lax',path:'/api/auth',maxAge:0});return res;}
export function authError(e:unknown){const known=e instanceof AuthProblem;return NextResponse.json({error:known?e.message:'Chưa thực hiện được đăng nhập. Vui lòng thử lại.'},{status:known?e.status:503,headers:{'Cache-Control':'private, no-store'}});}
