'use client';
import { weddingMapUrl } from '@/lib/maps';
import type { Wedding,Venue } from '@/lib/wedding';
import { venueName,weddingAtVenue,type VenueId } from '@/lib/venues';
import VenueQr from './venue-qr';
export function VenuePicker({w,value,onChange,disabled=false}:{w:Wedding;value:VenueId;onChange:(id:VenueId)=>void;disabled?:boolean}){
 return <label className="modal-label venue-picker">Địa điểm trên thiệp<select value={value} onChange={e=>onChange(Number(e.target.value) as VenueId)} disabled={disabled}><option value={1}>{venueName(w,1)}</option>{w.secondVenue&&<option value={2}>{venueName(w,2)}</option>}</select></label>;
}
export default function VenueSettings({w,update}:{w:Wedding;update:<K extends keyof Wedding>(key:K,value:Wedding[K])=>void}){
 function fields(v:Venue,id:VenueId){
  function change(key:'venue'|'address'|'mapUrl',value:string){if(id===1)update(key,value);else update('secondVenue',{...v,[key]:value});}
  const resolved=weddingAtVenue(w,id);
  return <fieldset className="venue-settings"><legend>Địa điểm {id}</legend><label>Tên địa điểm {id} / sảnh tiệc<input required maxLength={200} value={v.venue} onChange={e=>change('venue',e.target.value)} placeholder="Tên nhà hàng, sảnh tiệc"/></label><label>Địa chỉ địa điểm {id}<input required maxLength={400} value={v.address} onChange={e=>change('address',e.target.value)} placeholder="Số nhà, đường, tỉnh / thành phố"/></label><label>Link bản đồ địa điểm {id} (không bắt buộc)<input type="url" maxLength={2048} pattern="https://.*" value={v.mapUrl??''} onChange={e=>change('mapUrl',e.target.value)} placeholder="https://maps.app.goo.gl/…"/></label><VenueQr wedding={resolved}/>{v.mapQr&&v.mapQr.url===weddingMapUrl(v)&&<a className="button outline" href={v.mapQr.image} download={`QR-dia-diem-${id}.svg`}>Tải mã QR địa điểm {id}</a>}</fieldset>;
 }
 return <>{fields(w,1)}{w.secondVenue?fields(w.secondVenue,2):<button type="button" className="button outline full" onClick={()=>update('secondVenue',{venue:'',address:'',mapUrl:''})}>+ Thêm địa điểm thứ hai</button>}<p className="field-help full">Dán link chia sẻ Google Maps để chọn đúng vị trí. Khi lưu thiệp, mỗi địa điểm có một QR được lưu sẵn và dùng chung cho các khách dự tiệc tại đó.</p><div className="full"><VenuePicker w={w} value={w.defaultVenue??1} onChange={id=>update('defaultVenue',id)}/><p className="field-help">Địa điểm mặc định khi xem trước và thêm khách mới. Mỗi khách vẫn giữ địa điểm đã được chọn khi tạo link.</p></div></>;
}
