import { env } from 'cloudflare:workers';
import { getAuthUser } from '@/lib/auth';
import { verifyOrigin } from '@/lib/auth-core';
import { Wedding, templates, expiryTime } from './wedding';
import { validPhotoPath } from './photo';
export function db(){if(!env.DB)throw new Error('Chưa kết nối được nơi lưu thiệp. Vui lòng thử lại.');return env.DB;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});}
export async function owner(){const u=await getAuthUser(); if(!u)throw new Error('AUTH');return u.userId;}
export const originCheck=verifyOrigin;
export function validateWedding(x:any):Wedding{
 const limits:Record<string,number>={groom:100,bride:100,venue:200,address:400,message:1500};
 for(const [k,max]of Object.entries(limits))if(typeof x[k]!=='string'||x[k].trim().length>max||(!x[k].trim()&&k!=='message'))throw new Error('Vui lòng điền đầy đủ thông tin thiệp.');
 if(!templates.some(t=>t.id===x.template))throw new Error('Mẫu thiệp không hợp lệ.');
 for(const k of ['date','expires'])if(typeof x[k]!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x[k])||!Number.isFinite(expiryTime(x[k]))||new Date(`${x[k]}T12:00:00Z`).toISOString().slice(0,10)!==x[k])throw new Error('Ngày không hợp lệ.');
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(x.time))throw new Error('Giờ không hợp lệ.');
 const result={}as Wedding; for(const k of Object.keys({...limits,date:0,expires:0,time:0,template:0})) (result as any)[k]=x[k].trim();
 if(x.orientation!==undefined&&!['portrait','landscape'].includes(x.orientation))throw new Error('Khổ thiệp không hợp lệ.');
 if(x.photoMode!==undefined&&!['fade','overlay','frame'].includes(x.photoMode))throw new Error('Kiểu hòa ảnh không hợp lệ.');
 if(x.photo!==undefined&&x.photo!==''&&!validPhotoPath(x.photo))throw new Error('Ảnh thiệp không hợp lệ.');
 result.orientation=x.orientation??'portrait';result.photoMode=x.photoMode??'fade';result.photo=x.photo??'';
 for(const key of ['photoOpacity','photoX','photoY'] as const){const value=x[key]??(key==='photoOpacity'?70:50);if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>100)throw new Error('Điều chỉnh ảnh không hợp lệ.');result[key]=value;}
 return result;
}
export function fail(e:unknown){if(!(e instanceof Error&&e.message==='AUTH'))console.error(e);return e instanceof Error&&e.message==='AUTH'?json({error:'Vui lòng đăng nhập để lưu thiệp.'},401):json({error:e instanceof Error?e.message:'Có lỗi xảy ra. Vui lòng thử lại.'},400);}
export async function ownWedding(user:string){return db().prepare('SELECT * FROM weddings WHERE owner = ?').bind(user).first<{id:string;data:string}>();}
