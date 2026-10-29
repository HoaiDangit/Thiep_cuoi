import { savedQr } from '@/lib/venue-qr';
import { guestWithPresentation,readGuestPresentation,validateGuestPresentation,applyGuestPresentation } from '@/lib/guest-presentation';
import { validHonorific,type Honorific } from '@/lib/honorifics';
import { validVenueId,venueAvailable,weddingAtVenue } from '@/lib/venues';
import { db,json,owner,originCheck,fail,ownWedding } from '@/lib/server';
import { guestExpiry } from '@/lib/wedding';
const requestIdPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export async function GET(){try{
 const wedding=await ownWedding(await owner());if(!wedding)return json({guests:[]});
 const guests=await db().prepare('SELECT token,name,honorific,presentation,expires,revoked,created,venue_id FROM guests WHERE wedding_id=? ORDER BY created DESC').bind(wedding.id).all();
 return json({guests:guests.results.map(guestWithPresentation)});
}catch(e){return fail(e);}}
export async function POST(r:Request){try{
 originCheck(r);const wedding=await ownWedding(await owner());if(!wedding)throw new Error('Hãy lưu thông tin thiệp trước.');
 const input:any=await r.json();
 if(!Array.isArray(input.names)||!input.names.length||input.names.length>40||input.names.some((name:unknown)=>typeof name!=='string'||!name.trim()||name.trim().length>120))throw new Error('Nhập 1–40 khách mời mỗi yêu cầu, tối đa 120 ký tự mỗi tên.');
 if(input.requestId!==undefined&&(typeof input.requestId!=='string'||!requestIdPattern.test(input.requestId)))throw new Error('Mã yêu cầu không hợp lệ.');
 const settings=JSON.parse(wedding.data),venueId=input.venueId??settings.defaultVenue??1;if(!validVenueId(venueId)||!venueAvailable(settings,venueId))throw new Error('Địa điểm khách mời không hợp lệ.');
 const honorific=input.honorific??'';if(!validHonorific(honorific))throw new Error('Danh xưng không hợp lệ.');
 const requestId=input.requestId??crypto.randomUUID(),now=Date.now(),expires=guestExpiry(now);
 const guests=await Promise.all(input.names.map(async(name:string,index:number)=>{const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify([wedding.id,requestId,index])));const token=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');return {token,name:name.trim(),honorific,expires,revoked:0,created:now,venue_id:venueId};}));
 const placeholders=guests.map(()=>'?').join(','),tokens=guests.map(g=>g.token);
 const existing=await db().prepare(`SELECT token,name,honorific,presentation,expires,revoked,created,venue_id FROM guests WHERE wedding_id=? AND token IN (${placeholders})`).bind(wedding.id,...tokens).all<{token:string;name:string;honorific:Honorific;presentation:string;expires:number;revoked:number;created:number;venue_id:1|2}>();
 if(existing.results.length){
  if(existing.results.length!==guests.length||guests.some((g:any)=>!existing.results.some(v=>v.token===g.token&&v.name===g.name&&v.venue_id===g.venue_id&&v.honorific===g.honorific)))throw new Error('Yêu cầu đã được sử dụng cho nhóm khách khác.');
  return json({guests:guests.map((g:any)=>guestWithPresentation(existing.results.find(v=>v.token===g.token)!))});
 }
 const total=await db().prepare('SELECT count(*) AS n FROM guests WHERE wedding_id=?').bind(wedding.id).first<{n:number}>();
 if((total?.n??0)+guests.length>400)throw new Error('Mỗi thiệp hỗ trợ tối đa 400 khách.');
 await db().batch(guests.map((g:any)=>db().prepare('INSERT INTO guests (token,wedding_id,name,honorific,expires,revoked,created,venue_id) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(token) DO NOTHING').bind(g.token,wedding.id,g.name,g.honorific,g.expires,0,g.created,g.venue_id)));
 const stored=await db().prepare(`SELECT token,name,honorific,presentation,expires,revoked,created,venue_id FROM guests WHERE wedding_id=? AND token IN (${placeholders})`).bind(wedding.id,...tokens).all<{token:string;name:string;honorific:Honorific;presentation:string;venue_id:1|2}>();
 if(stored.results.length!==guests.length||guests.some(g=>!stored.results.some(v=>v.token===g.token&&v.name===g.name&&v.venue_id===g.venue_id&&v.honorific===g.honorific)))throw new Error('Conflicting guest creation request.');
 return json({guests:guests.map((g:any)=>guestWithPresentation(stored.results.find(v=>v.token===g.token)!))});
}catch(e){return fail(e);}}
export async function PATCH(r:Request){try{
 originCheck(r);const wedding=await ownWedding(await owner());if(!wedding)throw new Error('Không tìm thấy thiệp.');
 const input:any=await r.json();if(typeof input.token!=='string')throw new Error('Link không hợp lệ.');
 const guest=await db().prepare('SELECT token,revoked,venue_id,honorific,presentation FROM guests WHERE token=? AND wedding_id=?').bind(input.token,wedding.id).first<{token:string;revoked:number;venue_id:1|2;honorific:Honorific;presentation:string}>();
 if(!guest)return json({error:'Không tìm thấy khách mời.'},404);
 if(input.action==='revoke')await db().prepare('UPDATE guests SET revoked=1 WHERE token=? AND wedding_id=?').bind(input.token,wedding.id).run();
 else{if(guest.revoked)throw new Error('Link đã thu hồi không thể chỉnh sửa.');if(typeof input.name!=='string'||!input.name.trim()||input.name.trim().length>120)throw new Error('Tên khách không hợp lệ.');const venueId=input.venueId??guest.venue_id;if(!validVenueId(venueId)||!venueAvailable(JSON.parse(wedding.data),venueId))throw new Error('Địa điểm khách mời không hợp lệ.');const honorific=input.honorific??guest.honorific;if(!validHonorific(honorific))throw new Error('Danh xưng không hợp lệ.');const presentation=input.presentation===undefined?readGuestPresentation(guest.presentation):validateGuestPresentation(input.presentation);if(presentation.venue!==undefined||presentation.address!==undefined||presentation.mapUrl!==undefined){const base=weddingAtVenue(JSON.parse(wedding.data),venueId);presentation.mapQr=await savedQr(applyGuestPresentation(base,presentation),applyGuestPresentation(base,readGuestPresentation(guest.presentation)));}await db().prepare('UPDATE guests SET name=?,venue_id=?,honorific=?,presentation=? WHERE token=? AND wedding_id=?').bind(input.name.trim(),venueId,honorific,JSON.stringify(presentation),input.token,wedding.id).run();}
 const stored=await db().prepare('SELECT token,name,honorific,presentation,expires,revoked,created,venue_id FROM guests WHERE token=? AND wedding_id=?').bind(input.token,wedding.id).first<{presentation:string}>();
 return json({saved:true,guest:stored?guestWithPresentation(stored):null});
}catch(e){return fail(e);}}
