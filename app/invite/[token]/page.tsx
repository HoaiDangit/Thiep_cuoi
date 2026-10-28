import { weddingMapUrl } from '@/lib/maps';
import { db } from '@/lib/server';
import Invitation from '@/app/invitation';
import { headers } from 'next/headers';
export const dynamic='force-dynamic';
export const metadata={title:'Bạn có một lời mời cưới · Lời Hẹn',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{token:string}>}){
 await headers();const {token}=await params;
 try{
 const record=await db().prepare('SELECT g.name,g.expires,g.revoked,w.data FROM guests g JOIN weddings w ON w.id=g.wedding_id WHERE g.token=?').bind(token).first<{name:string;expires:number;revoked:number;data:string}>();
 if(!record||record.revoked||record.expires<=Date.now())return <main className="closed-invite"><div className="brand">Lời Hẹn<span>✦</span></div><h1>Lời mời này đã khép lại</h1><p>Link đã hết hạn, được thu hồi hoặc không tồn tại. Vui lòng liên hệ cô dâu, chú rể để nhận thiệp mới.</p></main>;
 const w=JSON.parse(record.data);return <main className="guest-page"><div className="guest-brand">Lời Hẹn <span>✦</span></div><Invitation wedding={w} guest={record.name}/><div className="guest-details"><p>Thiệp dành riêng cho <strong>{record.name}</strong></p><p>Có thể xem đến {new Date(record.expires).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</p><a href={weddingMapUrl(w)} target="_blank" rel="noreferrer" className="button primary">Xem đường đến tiệc cưới</a></div></main>;
 }catch(e){console.error(e);return <main className="closed-invite"><h1>Chưa mở được thiệp</h1><p>Vui lòng tải lại trang sau ít phút.</p></main>;}
}
