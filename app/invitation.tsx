import InvitationText from './invitation-text';
import type { InvitationTextEditor } from '@/lib/guest-presentation';
import ReferenceInvitation,{referenceTemplates} from './reference-invitation';
import { guestSalutation,guestWording,invitationMessage,type Honorific } from '@/lib/honorifics';
import { appPath } from '@/lib/paths';
import VenueQr from './venue-qr';
import { Wedding,prettyDate } from '@/lib/wedding';
import type { CSSProperties } from 'react';
export default function Invitation({wedding:w,guest='Bạn và người thương',compact=false,honorific='',onEditText}:{wedding:Wedding;guest?:string;compact?:boolean;honorific?:Honorific;onEditText?:InvitationTextEditor}){
 if(referenceTemplates.includes(w.template))return <ReferenceInvitation wedding={w} guest={guest} compact={compact} honorific={honorific} onEditText={onEditText}/>;
 const wording=guestWording(honorific);
 const blended=['mist','sunset','ivory','botanical','velvet','moonlight','rose','film'].includes(w.template)||!!w.photo;
 const photo=blended||['garden','editorial','peach'].includes(w.template);
 const mode=w.photoMode??'fade';
 const style={'--photo-scale':(w.photoScale??100)/100,'--photo-opacity':(w.photoOpacity??70)/100,'--photo-position':`${w.photoX??50}% ${w.photoY??50}%`} as CSSProperties;
 return <article style={style} className={`invitation theme-${w.template} orientation-${w.orientation??'portrait'} ${blended?'blended blend-'+mode:''} ${compact?'compact':''}`}>
 {photo&&<div className="invite-photo"><img src={appPath(w.photo||'/wedding.png')} alt={w.photo?'Ảnh của đôi uyên ương':'Ảnh cưới minh họa của đôi uyên ương'}/><span>WE ARE GETTING MARRIED</span></div>}
 <div className="invite-inner"><div className="invite-overline">TRÂN TRỌNG KÍNH MỜI</div><p className="guest-name"><InvitationText value={guestSalutation(guest,honorific)} field="name" onEdit={onEditText}/></p>
 <div className="fine-line"/><p className="invite-label">ĐẾN DỰ TIỆC CƯỚI CỦA</p>
 <h2>{w.groom||'Chú rể'}<em>&</em>{w.bride||'Cô dâu'}</h2>
 <div className="invite-date"><span><InvitationText value={w.time||'18:00'} field="time" onEdit={onEditText}/></span><strong><InvitationText value={prettyDate(w.date)} field="date" onEdit={onEditText}/></strong><span>VIỆT NAM</span></div>
 <p className="invite-venue"><InvitationText value={w.venue||'Địa điểm tổ chức'} field="venue" onEdit={onEditText}/></p>{!compact&&<><>{onEditText?<p className="invite-address"><InvitationText value={w.address} field="address" onEdit={onEditText}/></p>:<VenueQr wedding={w}/>}</><p className="invite-message"><InvitationText value={invitationMessage(w.message,honorific)} field="message" onEdit={onEditText}/></p></>}
 <div className="invite-bottom">Sự hiện diện của {wording.recipient} là niềm hạnh phúc của {wording.self}.</div></div>
 </article>;
}
