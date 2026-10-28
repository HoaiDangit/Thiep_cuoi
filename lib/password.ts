import { pbkdf2,randomBytes,timingSafeEqual,createHmac } from 'node:crypto';
import { Buffer } from 'node:buffer';
// Production Workers caps each PBKDF2 call at 100,000 iterations. Keep an
// independent server-secret pepper so a database dump cannot verify guesses.
export const PASSWORD_ITERATIONS=100000;
export type PasswordRecord={salt:string;password_hash:string;iterations:number;updated:number};
export function validNewPassword(value:unknown):value is string{return typeof value==='string'&&value.length>=8&&value.length<=256;}
function derive(password:string,salt:string,iterations:number):Promise<Buffer>{return new Promise((resolve,reject)=>pbkdf2(password,Buffer.from(salt,'hex'),iterations,32,'sha256',(error,key)=>error?reject(error):resolve(key)));}
function peppered(key:Buffer,pepper:string){if(pepper.length<16)throw new Error('Password pepper is not configured.');return createHmac('sha256',pepper).update(key).digest();}
export async function makePasswordRecord(password:string,pepper:string):Promise<PasswordRecord>{
 if(!validNewPassword(password))throw new Error('Mật khẩu cần từ 8 đến 256 ký tự.');
 const salt=randomBytes(32).toString('hex');
 return {salt,password_hash:peppered(await derive(password,salt,PASSWORD_ITERATIONS),pepper).toString('hex'),iterations:PASSWORD_ITERATIONS,updated:Date.now()};
}
export async function verifyPersonalPassword(password:string,record:PasswordRecord,pepper:string){
 if(!/^[a-f0-9]{64}$/.test(record.salt)||!/^[a-f0-9]{64}$/.test(record.password_hash)||record.iterations!==PASSWORD_ITERATIONS)return false;
 return timingSafeEqual(peppered(await derive(password,record.salt,record.iterations),pepper),Buffer.from(record.password_hash,'hex'));
}
