import { pbkdf2,randomBytes,timingSafeEqual } from 'node:crypto';
export const PASSWORD_ITERATIONS=600000;
export type PasswordRecord={salt:string;password_hash:string;iterations:number;updated:number};
export function validNewPassword(value:unknown):value is string{return typeof value==='string'&&value.length>=16&&value.length<=256;}
function derive(password:string,salt:string,iterations:number):Promise<Buffer>{return new Promise((resolve,reject)=>pbkdf2(password,Buffer.from(salt,'hex'),iterations,32,'sha256',(error,key)=>error?reject(error):resolve(key)));}
export async function makePasswordRecord(password:string):Promise<PasswordRecord>{
 if(!validNewPassword(password))throw new Error('Mật khẩu cần từ 16 đến 256 ký tự.');
 const salt=randomBytes(32).toString('hex');
 return {salt,password_hash:(await derive(password,salt,PASSWORD_ITERATIONS)).toString('hex'),iterations:PASSWORD_ITERATIONS,updated:Date.now()};
}
export async function verifyPersonalPassword(password:string,record:PasswordRecord){
 if(!/^[a-f0-9]{64}$/.test(record.salt)||!/^[a-f0-9]{64}$/.test(record.password_hash)||record.iterations!==PASSWORD_ITERATIONS)return false;
 return timingSafeEqual(await derive(password,record.salt,record.iterations),Buffer.from(record.password_hash,'hex'));
}
