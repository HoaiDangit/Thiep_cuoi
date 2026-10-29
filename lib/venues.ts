import type { Wedding } from './wedding';
export type VenueId=1|2;
export function validVenueId(value:unknown):value is VenueId{return value===1||value===2;}
export function venueAvailable(w:Wedding,id:VenueId){return id===1||!!w.secondVenue;}
export function weddingAtVenue(w:Wedding,id:VenueId=w.defaultVenue??1):Wedding{
 const {secondVenue,...base}=w;
 if(id===2&&secondVenue)return {...base,...secondVenue,defaultVenue:2};
 return {...base,defaultVenue:1};
}
export function venueName(w:Wedding,id:VenueId=1){return `${weddingAtVenue(w,id).kind??(id===2?'Nhà gái':'Nhà trai')} · ${weddingAtVenue(w,id).venue}`;}
