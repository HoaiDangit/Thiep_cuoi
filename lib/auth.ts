import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AuthProblem } from './auth-core';
import { digest,passwordMatches,validAdminToken,ADMIN_SESSION_MS } from './admin-core';
import { makePasswordRecord,verifyPersonalPassword,validNewPassword,type PasswordRecord } from './password';
export const ACCESS_COOKIE='loi_hen_access',REFRESH_COOKIE='loi_hen_refresh';
function authDb(){if(!env.DB)throw new AuthProblem('Chưa cấu hình database.',503);return env.DB;}
function passwordPepper(){if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<16)throw new AuthProblem('Máy chủ chưa cấu hình khóa bảo vệ mật khẩu.',503);return env.ADMIN_PASSWORD;}
async function personalCredential(){return authDb().prepare("SELECT salt,password_hash,iterations,updated FROM admin_credentials WHERE id='admin'").first<PasswordRecord>();}
async function recordTag(record:PasswordRecord){return digest('personal:'+JSON.stringify([record.salt,record.password_hash,record.iterations,record.updated]));}
async function currentCredential(){
 const record=await personalCredential();
 if(record)return {record,tag:await recordTag(record),legacy:null};
 if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<16)throw new AuthProblem('Chưa thiết lập quản trị. Vui lòng mở link thiết lập riêng.',503);
 return {record:null,tag:await digest(env.ADMIN_PASSWORD),legacy:env.ADMIN_PASSWORD};
}
async function matches(password:string,credential:Awaited<ReturnType<typeof currentCredential>>){return credential.record?verifyPersonalPassword(password,credential.record,passwordPepper()):passwordMatches(password,credential.legacy!);}
function passwordInput(password:unknown):asserts password is string{if(typeof password!=='string'||!password.length||password.length>256)throw new AuthProblem('Vui lòng nhập mật khẩu quản trị.');}
async function authAttempt(r:Request,purpose:string){
 const now=Date.now(),key=await digest(purpose+':'+(r.headers.get('cf-connecting-ip')||'local'));
 const attempt=await authDb().prepare('INSERT INTO admin_login_attempts (key,attempts,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires<=? THEN 1 ELSE attempts+1 END, expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING attempts').bind(key,now+15*60*1000,now,now).first<{attempts:number}>();
 if((attempt?.attempts??6)>5)throw new AuthProblem('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.',429);
 return key;
}
export async function adminSession(token:unknown){
 if(!validAdminToken(token))return null;
 const row=await authDb().prepare('SELECT expires,credential_tag FROM admin_sessions WHERE token_hash=? AND expires>?').bind(await digest(token),Date.now()).first<{expires:number;credential_tag:string}>();
 if(!row)return null;
 return row.credential_tag===(await currentCredential()).tag?row:null;
}
export async function getAuthUser(){const session=await adminSession((await cookies()).get(ACCESS_COOKIE)?.value);return session?{userId:'admin',email:'',displayName:'Quản trị viên'}:null;}
async function issueSession(r:Request,tag:string,attemptKey:string){
 const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-',''),now=Date.now(),expires=now+ADMIN_SESSION_MS;
 await authDb().batch([authDb().prepare('DELETE FROM admin_sessions WHERE expires<=?').bind(now),authDb().prepare('DELETE FROM admin_login_attempts WHERE key=? OR expires<=?').bind(attemptKey,now),authDb().prepare('INSERT INTO admin_sessions (token_hash,expires,credential_tag) VALUES (?,?,?)').bind(await digest(token),expires,tag)]);
 return setSession(r,token,expires);
}
export async function loginAdmin(r:Request,password:unknown){
 passwordInput(password);const key=await authAttempt(r,'login'),credential=await currentCredential();
 if(!await matches(password,credential))throw new AuthProblem('Mật khẩu quản trị chưa đúng.',401);
 return issueSession(r,credential.tag,key);
}
async function storePersonalPassword(r:Request,password:string,condition:string,conditionArgs:(string|number)[],attemptKey:string){
 const record=await makePasswordRecord(password,passwordPepper()),{salt,password_hash,iterations,updated}=record;
 const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-',''),expires=Date.now()+ADMIN_SESSION_MS;
 const tag=await recordTag(record);
 const fresh="EXISTS (SELECT 1 FROM admin_credentials WHERE id='admin' AND password_hash=?)";
 const result=await authDb().batch([
  authDb().prepare(`INSERT INTO admin_credentials (id,salt,password_hash,iterations,updated) SELECT 'admin',?,?,?,? WHERE ${condition} ON CONFLICT(id) DO UPDATE SET salt=excluded.salt,password_hash=excluded.password_hash,iterations=excluded.iterations,updated=excluded.updated`).bind(salt,password_hash,iterations,updated,...conditionArgs),
  authDb().prepare(`DELETE FROM admin_sessions WHERE ${fresh}`).bind(password_hash),
  authDb().prepare(`DELETE FROM admin_setup_tokens WHERE ${fresh}`).bind(password_hash),
  authDb().prepare(`INSERT INTO admin_sessions (token_hash,expires,credential_tag) SELECT ?,?,? WHERE ${fresh}`).bind(await digest(token),expires,tag,password_hash),
  authDb().prepare(`DELETE FROM admin_login_attempts WHERE key=? AND ${fresh}`).bind(attemptKey,password_hash)
 ]);
 if(result[0].meta.changes!==1)throw new AuthProblem('Link thiết lập đã được dùng hoặc thông tin đăng nhập đã thay đổi. Vui lòng thử lại.',409);
 return setSession(r,token,expires);
}
export async function checkAdminSetup(r:Request,input:any){
 if(!input||!validAdminToken(input.token))throw new AuthProblem('Cần link thiết lập riêng còn hiệu lực.',403);
 const valid=await authDb().prepare('SELECT expires FROM admin_setup_tokens WHERE token_hash=? AND expires>?').bind(await digest(input.token),Date.now()).first();
 if(!valid)throw new AuthProblem('Link thiết lập đã hết hạn hoặc đã được sử dụng.',403);
 const pepper=passwordPepper(),sample='Setup readiness check';
 const record=await makePasswordRecord(sample,pepper);
 if(!await verifyPersonalPassword(sample,record,pepper))throw new AuthProblem('Máy chủ chưa sẵn sàng để thiết lập mật khẩu.',503);
 await authDb().prepare('DELETE FROM admin_login_attempts WHERE key=?').bind(await digest('setup:'+(r.headers.get('cf-connecting-ip')||'local'))).run();
 return {ready:true};
}
export async function setupAdmin(r:Request,input:any){
 if(!input||!validAdminToken(input.token))throw new AuthProblem('Cần link thiết lập riêng còn hiệu lực.',403);
 if(!validNewPassword(input.password))throw new AuthProblem('Mật khẩu cá nhân cần từ 8 đến 256 ký tự.');
 const key=await authAttempt(r,'setup'),tokenHash=await digest(input.token);
 const valid=await authDb().prepare('SELECT expires FROM admin_setup_tokens WHERE token_hash=? AND expires>?').bind(tokenHash,Date.now()).first();
 if(!valid)throw new AuthProblem('Link thiết lập đã hết hạn hoặc đã được sử dụng.',403);
 return storePersonalPassword(r,input.password,"EXISTS (SELECT 1 FROM admin_setup_tokens WHERE token_hash=? AND expires>(julianday('now')-2440587.5)*86400000)",[tokenHash],key);
}
export async function changeAdminPassword(r:Request,input:any){
 if(!await getAuthUser())throw new AuthProblem('Vui lòng đăng nhập trước khi đổi mật khẩu.',401);
 passwordInput(input?.currentPassword);
 if(!validNewPassword(input.password))throw new AuthProblem('Mật khẩu mới cần từ 8 đến 256 ký tự.');
 const key=await authAttempt(r,'change-password'),credential=await currentCredential();
 if(!await matches(input.currentPassword,credential))throw new AuthProblem('Mật khẩu hiện tại chưa đúng.',401);
 return credential.record?storePersonalPassword(r,input.password,"EXISTS (SELECT 1 FROM admin_credentials WHERE id='admin' AND password_hash=? AND salt=?)",[credential.record.password_hash,credential.record.salt],key):storePersonalPassword(r,input.password,"NOT EXISTS (SELECT 1 FROM admin_credentials WHERE id='admin')",[],key);
}
export function setSession(r:Request,token:string,expires:number){const res=NextResponse.json({signedIn:true},{headers:{'Cache-Control':'private, no-store'}});const secure=new URL(r.url).protocol==='https:',maxAge=Math.max(0,Math.floor((expires-Date.now())/1000));res.cookies.set(ACCESS_COOKIE,token,{httpOnly:true,secure,sameSite:'lax',path:'/',maxAge});res.cookies.set(REFRESH_COOKIE,token,{httpOnly:true,secure,sameSite:'lax',path:'/api/auth',maxAge});return res;}
export async function revokeSession(token:unknown){if(validAdminToken(token))await authDb().prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();}
export function clearSession(){const res=NextResponse.json({signedIn:false},{headers:{'Cache-Control':'private, no-store'}});for(const [name,path]of [[ACCESS_COOKIE,'/'],[REFRESH_COOKIE,'/api/auth']])res.cookies.set(name,'',{httpOnly:true,sameSite:'lax',path,maxAge:0});return res;}
export function authError(e:unknown,action:'login'|'setup'|'password'='login'){const known=e instanceof AuthProblem;if(!known)console.error('Authentication server failure',{category:e instanceof Error&&/pbkdf|scrypt|crypto/i.test(e.message)?'password-hashing':e instanceof Error&&/D1|database|SQL/i.test(e.message)?'database':'unknown'});return NextResponse.json({error:known?e.message:action==='setup'?'Chưa thiết lập được mật khẩu do lỗi máy chủ. Vui lòng thử lại.':action==='password'?'Chưa đổi được mật khẩu do lỗi máy chủ. Vui lòng thử lại.':'Chưa thực hiện được đăng nhập. Vui lòng thử lại.'},{status:known?e.status:503,headers:{'Cache-Control':'private, no-store'}});}
