import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { Wedding, templates, expiryTime } from './wedding';
export function db(){if(!env.DB)throw new Error('Chưa kết nối được nơi lưu thiệp. Vui lòng thử lại.');return env.DB;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});}
export async function owner(){const u=await getChatGPTUser(); if(!u)throw new Error('AUTH');return u.userId;}
export function originCheck(r:Request){const o=r.headers.get('origin');if(o&&o!==new URL(r.url).origin)throw new Error('Yêu cầu không hợp lệ.');}
export function validateWedding(x:any):Wedding{
 const limits:Record<string,number>={groom:100,bride:100,venue:200,address:400,message:1500};
 for(const [k,max]of Object.entries(limits))if(typeof x[k]!=='string'||x[k].trim().length>max||(!x[k].trim()&&k!=='message'))throw new Error('Vui lòng điền đầy đủ thông tin thiệp.');
 if(!templates.some(t=>t.id===x.template))throw new Error('Mẫu thiệp không hợp lệ.');
 for(const k of ['date','expires'])if(typeof x[k]!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x[k])||!Number.isFinite(expiryTime(x[k]))||new Date(`${x[k]}T12:00:00Z`).toISOString().slice(0,10)!==x[k])throw new Error('Ngày không hợp lệ.');
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(x.time))throw new Error('Giờ không hợp lệ.');
 const result={}as Wedding; for(const k of Object.keys({...limits,date:0,expires:0,time:0,template:0})) (result as any)[k]=x[k].trim();return result;
}
export function fail(e:unknown){console.error(e);return e instanceof Error&&e.message==='AUTH'?json({error:'Vui lòng đăng nhập để lưu thiệp.'},401):json({error:e instanceof Error?e.message:'Có lỗi xảy ra. Vui lòng thử lại.'},400);}
export async function ownWedding(user:string){return db().prepare('SELECT * FROM weddings WHERE owner = ?').bind(user).first<{id:string;data:string}>();}
