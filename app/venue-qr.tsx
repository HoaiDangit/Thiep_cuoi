'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin,X } from 'lucide-react';
import { Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose } from '@/components/ui/dialog';
import { weddingMapUrl } from '@/lib/maps';
import type { Wedding } from '@/lib/wedding';
export default function VenueQr({wedding,settings=false}:{wedding:Wedding;settings?:boolean}){
 const [open,setOpen]=useState(false);
 const url=weddingMapUrl(wedding);
 if(!url)return null;
 return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button type="button" className={settings?'button outline venue-qr-trigger':'invite-address venue-address-trigger'} aria-label={`Xem mã QR và địa chỉ ${wedding.venue}`}><MapPin size={14} aria-hidden="true"/><span>{settings?'Xem mã QR địa điểm':wedding.address||wedding.venue}</span></button></DialogTrigger><DialogContent className="venue-qr-dialog" showCloseButton={false}><DialogTitle>Đường đến tiệc cưới</DialogTitle><DialogDescription>Quét mã QR hoặc mở bản đồ để tìm đường.</DialogDescription>{open&&<div className="venue-qr-code">{wedding.mapQr?.url===url?<img src={wedding.mapQr.image} width={256} height={256} alt={`Mã QR chỉ đường đến ${wedding.venue}`}/>:<QRCodeSVG value={url} size={256} level="M" marginSize={4} bgColor="#ffffff" fgColor="#000000" title={`Mã QR chỉ đường đến ${wedding.venue}`}/>}</div>}<a className="button primary" href={url} target="_blank" rel="noopener noreferrer">Mở bản đồ chỉ đường ↗</a><div className="venue-qr-address"><strong>{wedding.venue}</strong><p>{wedding.address}</p></div><DialogClose asChild><button type="button" className="venue-qr-close" aria-label="Đóng mã QR"><X size={18}/></button></DialogClose></DialogContent></Dialog>;
}
