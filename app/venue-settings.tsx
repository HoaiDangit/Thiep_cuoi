'use client';
import { useState } from 'react';
import { Pencil,MapPin } from 'lucide-react';
import { weddingMapUrl } from '@/lib/maps';
import type { Wedding,Venue,VenueKind } from '@/lib/wedding';
import { venueName,weddingAtVenue,type VenueId } from '@/lib/venues';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import VenueQr from './venue-qr';
const kinds:VenueKind[]=['Nhà trai','Nhà gái','Nhà hàng','Khác'];
export function VenuePicker({w,value,onChange,disabled=false}:{w:Wedding;value:VenueId;onChange:(id:VenueId)=>void;disabled?:boolean}){
 return <label className="modal-label venue-picker">Địa điểm trên thiệp<select value={value} onChange={e=>onChange(Number(e.target.value) as VenueId)} disabled={disabled}><option value={1}>{venueName(w,1)}</option>{w.secondVenue&&<option value={2}>{venueName(w,2)}</option>}</select></label>;
}
export default function VenueSettings({w,update}:{w:Wedding;update:<K extends keyof Wedding>(key:K,value:Wedding[K])=>void}){
 const [editing,setEditing]=useState<VenueId|null>(null),[draft,setDraft]=useState<Venue>({kind:'Nhà trai',venue:'',address:'',mapUrl:''}),[error,setError]=useState('');
 function open(id:VenueId){const existing=id===1?w:w.secondVenue;setDraft({...existing,kind:existing?.kind??(id===1?'Nhà trai':'Nhà gái'),venue:existing?.venue??'',address:existing?.address??'',mapUrl:existing?.mapUrl??''});setError('');setEditing(id);}
 function save(){
  if(!draft.venue.trim()||!draft.address.trim()){setError('Vui lòng nhập tên địa điểm và địa chỉ.');return;}
  if(draft.mapUrl?.trim()){try{const url=new URL(draft.mapUrl.trim());if(url.protocol!=='https:'||url.username||url.password||draft.mapUrl.length>2048)throw new Error();}catch{setError('Link bản đồ cần là đường dẫn HTTPS hợp lệ.');return;}}
  const next={...draft,venue:draft.venue.trim(),address:draft.address.trim(),mapUrl:draft.mapUrl?.trim()??''};
  if(editing===1){update('kind',next.kind);update('venue',next.venue);update('address',next.address);update('mapUrl',next.mapUrl);}else update('secondVenue',next);
  setEditing(null);
 }
 return <section className="venue-settings full"><VenuePicker w={w} value={w.defaultVenue??1} onChange={id=>update('defaultVenue',id)}/>
  {([1,2] as VenueId[]).filter(id=>id===1||!!w.secondVenue).map(id=>{const v=weddingAtVenue(w,id);return <div className={'venue-row '+((w.defaultVenue??1)===id?'selected':'')} key={id}><MapPin size={18}/><div><strong>{v.kind??(id===1?'Nhà trai':'Nhà gái')}</strong><span>{v.venue}</span><p>{v.address}</p></div><button type="button" className="venue-edit" aria-label={`Chỉnh sửa địa chỉ ${v.kind??(id===1?'Nhà trai':'Nhà gái')}`} title="Chỉnh sửa địa chỉ" onClick={()=>open(id)}><Pencil size={18}/></button></div>;})}
  {!w.secondVenue&&<button type="button" className="button outline" onClick={()=>open(2)}>+ Thêm địa điểm thứ hai</button>}
  <p className="field-help">Chọn địa điểm có sẵn. Bấm bút chì bên phải để chỉnh sửa. Mỗi khách giữ địa điểm đã chọn khi tạo link.</p>
  <Dialog open={editing!==null} onOpenChange={open=>{if(!open)setEditing(null);}}><DialogContent className="venue-editor-dialog"><DialogTitle>Chỉnh sửa địa điểm</DialogTitle><DialogDescription>Thông tin được dùng lại cho khách mời và mã QR chỉ đường.</DialogDescription>
   <label className="modal-label">Loại địa điểm<select value={draft.kind} onChange={e=>setDraft({...draft,kind:e.target.value as VenueKind})}>{kinds.map(kind=><option key={kind}>{kind}</option>)}</select></label>
   <label className="modal-label">Tên địa điểm / sảnh tiệc<input maxLength={200} value={draft.venue} onChange={e=>setDraft({...draft,venue:e.target.value})}/></label>
   <label className="modal-label">Địa chỉ<input maxLength={400} value={draft.address} onChange={e=>setDraft({...draft,address:e.target.value})}/></label>
   <label className="modal-label">Link Google Maps (không bắt buộc)<input type="url" maxLength={2048} value={draft.mapUrl??''} placeholder="https://maps.app.goo.gl/…" onChange={e=>setDraft({...draft,mapUrl:e.target.value})}/></label>
   {error&&<p className="notice error" role="alert">{error}</p>}
   {draft.venue&&draft.address&&<VenueQr wedding={{...w,...draft}} settings/>}
   {draft.mapQr?.url===weddingMapUrl(draft)&&<a className="button outline" href={draft.mapQr.image} download={`QR-dia-diem-${editing}.svg`}>Tải mã QR địa điểm</a>}
   <button type="button" className="button primary" onClick={save}>Áp dụng địa điểm</button><p className="field-help">Bấm “Lưu thiệp” để cập nhật các link đã gửi.</p>
  </DialogContent></Dialog>
 </section>;
}
