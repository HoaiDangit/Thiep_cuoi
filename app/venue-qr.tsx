'use client';
import { QRCodeSVG } from 'qrcode.react';
import { weddingMapUrl } from '@/lib/maps';
import type { Wedding } from '@/lib/wedding';
export default function VenueQr({wedding}:{wedding:Wedding}){
 const url=weddingMapUrl(wedding);
 if(!url)return null;
 return <div className="venue-qr"><a href={url} target="_blank" rel="noopener noreferrer" aria-label="Mở bản đồ địa điểm tổ chức tiệc cưới">{wedding.mapQr?.url===url?<img src={wedding.mapQr.image} width={192} height={192} alt="Mã QR bản đồ địa điểm tổ chức tiệc cưới"/>:<QRCodeSVG value={url} size={192} level="M" marginSize={4} bgColor="#ffffff" fgColor="#000000" title="Mã QR bản đồ địa điểm tổ chức tiệc cưới"/>}</a><p>Quét mã QR để tìm đường đến tiệc cưới</p><a className="venue-map-link" href={url} target="_blank" rel="noopener noreferrer">Mở bản đồ chỉ đường ↗</a></div>;
}
