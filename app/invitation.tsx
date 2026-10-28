import VenueQr from './venue-qr';
import { Wedding,prettyDate } from '@/lib/wedding';
import type { CSSProperties } from 'react';
export default function Invitation({wedding:w,guest='Bạn và người thương',compact=false}:{wedding:Wedding;guest?:string;compact?:boolean}){
 const blended=['mist','sunset','ivory','botanical','velvet','moonlight','rose','film'].includes(w.template)||!!w.photo;
 const photo=blended||['garden','editorial','peach'].includes(w.template);
 const mode=w.photoMode??'fade';
 const style={'--photo-opacity':(w.photoOpacity??70)/100,'--photo-position':`${w.photoX??50}% ${w.photoY??50}%`} as CSSProperties;
 return <article style={style} className={`invitation theme-${w.template} orientation-${w.orientation??'portrait'} ${blended?'blended blend-'+mode:''} ${compact?'compact':''}`}>
 {photo&&<div className="invite-photo"><img src={w.photo||'/wedding.png'} alt={w.photo?'Ảnh của đôi uyên ương':'Ảnh cưới minh họa của đôi uyên ương'}/><span>WE ARE GETTING MARRIED</span></div>}
 <div className="invite-inner"><div className="invite-overline">TRÂN TRỌNG KÍNH MỜI</div><p className="guest-name">{guest}</p>
 <div className="fine-line"/><p className="invite-label">ĐẾN DỰ TIỆC CƯỚI CỦA</p>
 <h2>{w.groom||'Chú rể'}<em>&</em>{w.bride||'Cô dâu'}</h2>
 <div className="invite-date"><span>{w.time||'18:00'}</span><strong>{prettyDate(w.date)}</strong><span>VIỆT NAM</span></div>
 <p className="invite-venue">{w.venue||'Địa điểm tổ chức'}</p>{!compact&&<><p className="invite-address">{w.address}</p><VenueQr wedding={w}/><p className="invite-message">{w.message}</p></>}
 <div className="invite-bottom">Sự hiện diện của bạn là niềm hạnh phúc của chúng mình.</div></div>
 </article>;
}
