import InvitationText from './invitation-text';
import type { InvitationTextEditor } from '@/lib/guest-presentation';
import type { CSSProperties } from 'react';
import { appPath } from '@/lib/paths';
import { guestSalutation,guestWording,invitationMessage,type Honorific } from '@/lib/honorifics';
import { prettyDate,type Wedding } from '@/lib/wedding';
import VenueQr from './venue-qr';
export const referenceTemplates=['vows','tide','duet','arch','scarlet','cinema'];
type Props={wedding:Wedding;guest:string;compact:boolean;honorific:Honorific;onEditText?:InvitationTextEditor};
export default function ReferenceInvitation({wedding:w,guest,compact,honorific,onEditText}:Props){
 const wording=guestWording(honorific),image=appPath(w.photo||'/wedding.png');
 const date=/^(\d{4})-(\d{2})-(\d{2})$/.exec(w.date),year=date?.[1]??'—',month=date?.[2]??'—',day=date?.[3]??'—';
 const style={'--photo-scale':(w.photoScale??100)/100,'--photo-position':`${w.photoX??50}% ${w.photoY??50}%`,'--photo-opacity':(w.photoOpacity??70)/100} as CSSProperties;
 const photo=(className:string,decorative=false)=><div className={className}><img src={image} alt={decorative?'':w.photo?'Ảnh của đôi uyên ương':'Ảnh cưới minh họa'} loading={compact?'lazy':undefined}/></div>;
 const names=<h2 className="ref-names"><span>{w.groom||'Chú rể'}</span><em>&</em><span>{w.bride||'Cô dâu'}</span></h2>;
 const greeting=<div className="ref-guest"><span>TRÂN TRỌNG KÍNH MỜI</span><strong><InvitationText value={guestSalutation(guest,honorific)} field="name" onEdit={onEditText}/></strong></div>;
 const details=<div className="ref-details"><p className="ref-event-label">ĐẾN DỰ TIỆC CƯỚI</p><div className="ref-date"><span><InvitationText value={w.time||'18:00'} field="time" onEdit={onEditText}/></span><strong><InvitationText value={prettyDate(w.date)} field="date" onEdit={onEditText}/></strong></div><p className="ref-location"><InvitationText value={w.venue||'Địa điểm tổ chức'} field="venue" onEdit={onEditText}/></p>{!compact&&<>{onEditText?<p className="invite-address"><InvitationText value={w.address} field="address" onEdit={onEditText}/></p>:<VenueQr wedding={w}/>}</>}</div>;
 const message=!compact&&<><p className="ref-message"><InvitationText value={invitationMessage(w.message,honorific)} field="message" onEdit={onEditText}/></p><p className="ref-thanks">Sự hiện diện của {wording.recipient} là niềm hạnh phúc của {wording.self}.</p></>;
 const dateStack=<div className="ref-date-stack" aria-label={`Ngày cưới ${prettyDate(w.date)}`}><span><InvitationText value={day} field="date" onEdit={onEditText}/></span><i>/</i><span><InvitationText value={month} field="date" onEdit={onEditText}/></span><small>{year}</small></div>;
 return <article style={style} className={`invitation ref-invite ref-${w.template} orientation-${w.orientation??'portrait'} ref-mode-${w.photoMode??'fade'} ${compact?'compact':''}`}>
  {(w.template==='vows'||w.template==='tide')&&<div className="ref-sheet"><div className="ref-hero">{photo('ref-photo')}<div className="ref-hero-top"><span className="ref-script">{w.template==='vows'?'Love':'We said yes'}</span><span className="ref-caption">MỘT ĐỜI · MỘT NGƯỜI THƯƠNG</span></div>{dateStack}<div className="ref-hero-names">{names}</div></div><div className="ref-copy">{greeting}{details}{message}</div></div>}
  {w.template==='duet'&&<div className="ref-sheet">{photo('ref-side-photo')}<div className="ref-copy"><p className="ref-caption">CHÚNG MÌNH VỀ CHUNG MỘT NHÀ</p>{names}<span className="ref-rule"/>{greeting}{details}{message}</div></div>}
  {w.template==='arch'&&<div className="ref-sheet"><div className="ref-arch-heading"><span>WEDDING INVITATION</span><i>✦</i><span>{year}</span></div>{photo('ref-arch-photo')}<div className="ref-copy"><span className="ref-ornament" aria-hidden="true">✧</span>{names}{greeting}{details}{message}</div></div>}
  {w.template==='scarlet'&&<div className="ref-sheet"><div className="ref-scarlet-heading"><span>HỶ SỰ</span><i aria-hidden="true">囍</i><span>NGÀY CHUNG ĐÔI</span></div>{names}<div className="ref-photo-strip" aria-label="Khung ảnh kỷ niệm">{photo('ref-strip-photo ref-strip-left')}{photo('ref-strip-photo ref-strip-center',true)}{photo('ref-strip-photo ref-strip-right',true)}</div><div className="ref-copy">{greeting}{details}{message}<span className="ref-seal" aria-hidden="true">♥</span></div></div>}
  {w.template==='cinema'&&<div className="ref-sheet"><div className="ref-cinema-heading"><span>CHUYỆN TÌNH CHÚNG MÌNH</span><span>♥</span><span>{year}</span></div><div className="ref-film-frame">{photo('ref-film-photo')}<div className="ref-film-title"><span>HÔM NAY & MÃI SAU</span>{names}</div></div><div className="ref-ticket"><div className="ref-ticket-date"><strong>{day}</strong><span>THÁNG {month}</span><small>{year}</small></div><div className="ref-copy">{greeting}{details}{message}</div></div><div className="ref-ticket-footer"><span>MỘT TẤM VÉ · MỘT ĐỜI BÊN NHAU</span><div className="ref-barcode" aria-hidden="true"/></div></div>}
 </article>;
}
