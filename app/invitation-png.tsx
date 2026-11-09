'use client';
import { useEffect,useRef,useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download,Loader2 } from 'lucide-react';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { applyGuestPresentation } from '@/lib/guest-presentation';
import { weddingAtVenue } from '@/lib/venues';
import { weddingMapUrl } from '@/lib/maps';
import { guestSalutation } from '@/lib/honorifics';
import { prettyDate,type Wedding,type Guest } from '@/lib/wedding';
import Invitation from './invitation';

export default function InvitationPng({guest,wedding,onClose}:{guest:Guest;wedding:Wedding;onClose:()=>void}){
 const sheet=useRef<HTMLDivElement>(null),[url,setUrl]=useState(''),[error,setError]=useState('');
 const shown=applyGuestPresentation(weddingAtVenue(guest.snapshot??wedding,guest.venue_id??1),guest.presentation),width=shown.orientation==='landscape'?900:600;
 useEffect(()=>{let active=true,objectUrl='';
  async function render(){try{
   const {toBlob}=await import('html-to-image');await document.fonts.ready;
   const node=sheet.current;if(!node)return;
   await Promise.all(Array.from(node.querySelectorAll('img')).map(async img=>{await img.decode();if(!img.naturalWidth)throw new Error('Chưa tải được ảnh cưới.');}));
   await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
   const height=Math.ceil(node.getBoundingClientRect().height);if(height>15000)throw new Error('Nội dung thiệp quá dài để xuất ảnh. Hãy rút gọn lời nhắn.');
   const blob=await toBlob(node,{width,height,pixelRatio:Math.min(2,15000/height),backgroundColor:'#ffffff',cacheBust:false,preferredFontFormat:'woff2'});
   if(!blob)throw new Error('Chưa tạo được ảnh PNG.');objectUrl=URL.createObjectURL(blob);if(active)setUrl(objectUrl);else URL.revokeObjectURL(objectUrl);
  }catch(e){if(active)setError((e as Error).message||'Chưa xuất được ảnh. Vui lòng thử lại.');}}
  void render();return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};
 },[]);
 const filename='Thiep-cuoi-'+guest.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,90)+'.png';
 return <><Dialog open onOpenChange={open=>{if(!open)onClose();}}><DialogContent className="png-preview-dialog"><DialogTitle>Ảnh thiệp của {guest.name}</DialogTitle><DialogDescription>Ảnh PNG đầy đủ nội dung và mã QR địa điểm của khách này.</DialogDescription>{error?<p className="notice error" role="alert">{error}</p>:url?<div className="png-preview-scroll"><img src={url} alt={`Ảnh thiệp đầy đủ của ${guest.name}`}/></div>:<p className="png-rendering" role="status"><Loader2 className="spin" size={20}/>Đang tạo ảnh thiệp…</p>}<div className="png-preview-actions"><button type="button" className="button outline" onClick={onClose}>Đóng</button>{url&&<a className="button primary" href={url} download={filename}><Download size={17}/>Tải PNG</a>}</div></DialogContent></Dialog>
 {typeof document!=='undefined'&&createPortal(<div className="png-render-host" aria-hidden="true"><div ref={sheet} className="invitation-png-sheet" style={{width}}><Invitation wedding={shown} guest={guest.name} honorific={guest.honorific}/><div className="png-venue-footer"><div><p className="png-venue-eyebrow">THIỆP MỜI DÀNH RIÊNG CHO</p><strong>{guestSalutation(guest.name,guest.honorific)}</strong><p>{shown.time} · {prettyDate(shown.date)}</p><h3>{shown.venue}</h3><p>{shown.address}</p><small>Quét mã QR để xem đường đến tiệc cưới.</small></div><div className="png-venue-qr"><QRCodeSVG value={weddingMapUrl(shown)} size={192} level="M" marginSize={4} bgColor="#fff" fgColor="#000"/><span>QR ĐỊA ĐIỂM TIỆC CƯỚI</span></div></div></div></div>,document.body)}</>;
}
