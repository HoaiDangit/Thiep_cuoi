export type AuthConfig={url:string;key:string};
export class AuthProblem extends Error{constructor(message:string,public status=400){super(message);}}
export function readAuthConfig(values:{SUPABASE_URL?:string;SUPABASE_PUBLISHABLE_KEY?:string}):AuthConfig{
 const key=values.SUPABASE_PUBLISHABLE_KEY,base=values.SUPABASE_URL;
 if(!base||!key)throw new AuthProblem('Chưa cấu hình đăng nhập. Hãy thiết lập SUPABASE_URL và SUPABASE_PUBLISHABLE_KEY trên máy chủ.',503);
 const u=new URL(base);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||!['','/'].includes(u.pathname)||!key.startsWith('sb_publishable_'))throw new AuthProblem('Cấu hình Supabase không hợp lệ. Hãy dùng URL dự án HTTPS và publishable key.',503);
 return {url:u.origin,key};
}
export function verifyOrigin(r:Request){const origin=r.headers.get('origin');if(r.headers.get('sec-fetch-site')==='cross-site'||origin!==new URL(r.url).origin)throw new AuthProblem('Yêu cầu không hợp lệ. Vui lòng tải lại trang.',403);}
export function credentials(x:any){if(!x||typeof x.email!=='string'||typeof x.password!=='string'||x.email.length>254||x.password.length>256||!/^\S+@\S+\.\S+$/.test(x.email.trim())||x.password.length<8)throw new AuthProblem('Nhập email hợp lệ và mật khẩu từ 8 ký tự.');return {email:x.email.trim(),password:x.password};}
export async function authCall(config:AuthConfig,path:string,body?:unknown,token?:string,transport:typeof fetch=fetch){
 let r:Response;try{r=await transport(config.url+'/auth/v1'+path,{method:body===undefined?'GET':'POST',headers:{apikey:config.key,...(body===undefined?{}:{'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{})},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(12000)});}catch{throw new AuthProblem('Chưa kết nối được dịch vụ đăng nhập. Vui lòng thử lại.',503);}
 if(r.status===429)throw new AuthProblem('Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.',429);
 if(r.status>=500)throw new AuthProblem('Dịch vụ đăng nhập đang tạm gián đoạn. Vui lòng thử lại.',503);
 const data:any=await r.json().catch(()=>null);
 if(!r.ok)throw new AuthProblem('Email hoặc mật khẩu chưa đúng, hoặc email chưa được xác nhận.',r.status===401?401:400);
 return data;
}
export function validSession(data:any){if(!data||typeof data.access_token!=='string'||typeof data.refresh_token!=='string'||data.access_token.length>3800||data.refresh_token.length>3800||!/^[\w.-]+$/.test(data.access_token)||!/^[\w.-]+$/.test(data.refresh_token)||!Number.isFinite(data.expires_in)||data.expires_in<=0)throw new AuthProblem('Dịch vụ đăng nhập trả về phiên không hợp lệ.',503);return {access:data.access_token,refresh:data.refresh_token,seconds:Math.min(data.expires_in,86400)};}
