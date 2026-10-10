import { db,owner,originCheck,json,fail } from '@/lib/server';
import { MAX_PHOTO_BYTES,photoType } from '@/lib/photo';
export async function POST(r:Request){try{
 originCheck(r);const user=await owner();
 if(Number(r.headers.get('content-length'))>MAX_PHOTO_BYTES+65536)return json({error:'Ảnh sau xử lý cần nhỏ hơn 1 MB.'},413);
 const form=await r.formData(),file=form.get('photo');
 if(!(file instanceof File)||!file.size||file.size>MAX_PHOTO_BYTES)return json({error:'Chọn ảnh JPG, PNG hoặc WebP nhỏ hơn 1 MB.'},413);
 const data=await file.arrayBuffer(),mime=photoType(new Uint8Array(data));
 if(!mime||mime!==file.type)return json({error:'Định dạng ảnh không hợp lệ. Chỉ nhận JPG, PNG hoặc WebP.'},400);
 const id=crypto.randomUUID();
 const result=await db().prepare('INSERT INTO photos (id,owner,mime,data,created) SELECT ?,?,?,?,? WHERE (SELECT count(*) FROM photos WHERE owner=?) < 20').bind(id,user,mime,data,Date.now(),user).run();
 if(!result.meta.changes)return json({error:'Bạn đã tải tối đa 20 ảnh. Vui lòng dùng ảnh đã tải trước đó.'},400);
 return json({photo:'/api/photos/'+id});
 }catch(e){return fail(e);}}
export async function GET(){try{const user=await owner();const rows=await db().prepare('SELECT id FROM photos WHERE owner=? ORDER BY created DESC').bind(user).all<{id:string}>();return json({photos:rows.results.map(p=>'/api/photos/'+p.id)});}catch(e){return fail(e);}}
