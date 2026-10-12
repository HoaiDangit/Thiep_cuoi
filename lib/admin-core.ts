export const ADMIN_SESSION_MS=7*24*60*60*1000;
export async function digest(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('');}
export async function passwordMatches(input:string,expected:string){const [a,b]=await Promise.all([digest(input),digest(expected)]);let difference=0;for(let i=0;i<a.length;i++)difference|=a.charCodeAt(i)^b.charCodeAt(i);return difference===0;}
export function validAdminToken(token:unknown):token is string{return typeof token==='string'&&/^[0-9a-f]{64}$/.test(token);}
