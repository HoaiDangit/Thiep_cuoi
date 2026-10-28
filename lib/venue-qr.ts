import QRCode from 'qrcode';
import { weddingMapUrl } from './maps';
import type { Wedding,Venue } from './wedding';
async function savedQr(venue:Venue,previous?:Venue){
 const url=weddingMapUrl(venue);
 if(previous?.mapQr?.url===url)return previous.mapQr;
 const svg=await QRCode.toString(url,{type:'svg',margin:4,errorCorrectionLevel:'M',width:384});
 return {url,image:`data:image/svg+xml;base64,${btoa(svg)}`};
}
export async function prepareVenueQrs(w:Wedding,previous?:Wedding):Promise<Wedding>{
 const mapQr=await savedQr(w,previous);
 const secondVenue=w.secondVenue?{...w.secondVenue,mapQr:await savedQr(w.secondVenue,previous?.secondVenue)}:undefined;
 return {...w,mapQr,secondVenue};
}
