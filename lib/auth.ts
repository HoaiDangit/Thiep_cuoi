import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AuthProblem } from './auth-core';
import { digest,passwordMatches,validAdminToken,ADMIN_SESSION_MS } from './admin-core';
export const ACCESS_COOKIE='loi_hen_access',REFRESH_COOKIE='loi_hen_refresh';
function authDb(){if(!env.DB)throw new AuthProblem('Chưa cấu hình database.',503);return env.DB;}
function adminPassword(){if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<16)throw new AuthProblem('Chưa cấu hình mật khẩu quản trị.',503);return env.ADMIN_PASSWORD;}
export async function adminSession(token:unknown){
 if(!validAdminToken(token))return null;
 const hash=await digest(token);
 const rows=await authDb().prepare('SELECT expires,credential_tag FROM admin_sessions WHERE token_hash=? AND expires>?').bind(hash,Date.now()).all<{expires:number;credential_tag:string}>();
 const row=rows.results[0];if(!row)return null;
 const tag=await digest(adminPassword());if(row.credential_tag!==tag)return null;return row;
}
export async function getAuthUser(){const session=await adminSession((await cookies()).get(ACCESS_COOKIE)?.value);return session?{userId:'admin',email:'',displayName:'Quản trị viên'}:null;}
export async function loginAdmin(r:Request,password:unknown){
 const expected=adminPassword();if(typeof password!=='string'||password.length>256||!password.length)throw new AuthProblem('Vui lòng nhập mật khẩu quản trị.');
 const now=Date.now(),key=await digest('login:'+ (r.headers.get('cf-connecting-ip')||'local'));
 const attempt=await authDb().prepare('INSERT INTO admin_login_attempts (key,attempts,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires<=? THEN 1 ELSE attempts+1 END, expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING attempts').bind(key,now+15*60*1000,now,now).first<{attempts:number}>();
 if((attempt?.attempts??6)>5)throw new AuthProblem('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.',429);
 if(!await passwordMatches(password,expected))throw new AuthProblem('Mật khẩu quản trị chưa đúng.',401);
 const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-',''),expires=now+ADMIN_SESSION_MS;
 await authDb().batch([authDb().prepare('DELETE FROM admin_sessions WHERE expires<=?').bind(now),authDb().prepare('DELETE FROM admin_login_attempts WHERE key=? OR expires<=?').bind(key,now),authDb().prepare('INSERT INTO admin_sessions (token_hash,expires,credential_tag) VALUES (?,?,?)').bind(await digest(token),expires,await digest(expected))]);
 return setSession(r,token,expires);
}
export function setSession(r:Request,token:string,expires:number){const res=NextResponse.json({signedIn:true},{headers:{'Cache-Control':'private, no-store'}});const secure=new URL(r.url).protocol==='https:',maxAge=Math.max(0,Math.floor((expires-Date.now())/1000));res.cookies.set(ACCESS_COOKIE,token,{httpOnly:true,secure,sameSite:'lax',path:'/',maxAge});res.cookies.set(REFRESH_COOKIE,token,{httpOnly:true,secure,sameSite:'lax',path:'/api/auth',maxAge});return res;}
export async function revokeSession(token:unknown){if(validAdminToken(token))await authDb().prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();}
export function clearSession(){const res=NextResponse.json({signedIn:false},{headers:{'Cache-Control':'private, no-store'}});for(const [name,path]of [[ACCESS_COOKIE,'/'],[REFRESH_COOKIE,'/api/auth']])res.cookies.set(name,'',{httpOnly:true,sameSite:'lax',path,maxAge:0});return res;}
export function authError(e:unknown){const known=e instanceof AuthProblem;return NextResponse.json({error:known?e.message:'Chưa thực hiện được đăng nhập. Vui lòng thử lại.'},{status:known?e.status:503,headers:{'Cache-Control':'private, no-store'}});}
