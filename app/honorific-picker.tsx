'use client';
import { honorifics,guestWording,type Honorific } from '@/lib/honorifics';
export default function HonorificPicker({value,onChange,disabled=false,single=false}:{value:Honorific;onChange:(value:Honorific)=>void;disabled?:boolean;single?:boolean}){
 const wording=guestWording(value);
 return <div className="honorific-picker"><label className="modal-label">Danh xưng khách mời<select value={value} disabled={disabled} onChange={e=>onChange(e.target.value as Honorific)}>{honorifics.map(h=><option key={h.id} value={h.id}>{h.label}</option>)}</select></label><p className="field-help">Lời mời xưng “{wording.self}”, gọi khách là “{wording.recipient}”. {single?'Áp dụng riêng cho khách mời này.':'Áp dụng cho các khách trong lần thêm này.'}</p></div>;
}
