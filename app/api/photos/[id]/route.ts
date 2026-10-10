import { db } from '@/lib/server';
import { validPhotoPath } from '@/lib/photo';
export async function GET(_r:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!validPhotoPath('/api/photos/'+id))return new Response('Not found',{status:404});
 const row=await db().prepare('SELECT mime,data FROM photos WHERE id=?').bind(id).first<{mime:string;data:number[]}>();
 if(!row)return new Response('Not found',{status:404});
 return new Response(new Uint8Array(row.data),{headers:{'Content-Type':row.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
