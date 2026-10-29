import type { Wedding } from './wedding';

export type GuestPresentation={message?:string;date?:string;time?:string;venue?:string;address?:string;mapUrl?:string;mapQr?:Wedding['mapQr'];photoScale?:number;photoX?:number;photoY?:number};
export type InvitationTextField='name'|'message'|'date'|'time'|'venue'|'address';
export type InvitationTextEditor=(field:InvitationTextField)=>void;
export function validateGuestPresentation(value:unknown):GuestPresentation{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Thông tin thiệp riêng không hợp lệ.');
 const input=value as Record<string,unknown>,result:GuestPresentation={};
 for(const key of Object.keys(input))if(!['message','date','time','venue','address','mapUrl','photoScale','photoX','photoY'].includes(key))throw new Error('Thông tin thiệp riêng không được hỗ trợ.');
 if(input.message!==undefined){if(typeof input.message!=='string'||input.message.length>1500)throw new Error('Lời nhắn riêng tối đa 1500 ký tự.');result.message=input.message.trim();}
 for(const [key,max] of [['venue',200],['address',400]] as const){if(input[key]===undefined)continue;if(typeof input[key]!=='string'||!input[key].trim()||input[key].trim().length>max)throw new Error('Tên địa điểm hoặc địa chỉ riêng không hợp lệ.');result[key]=input[key].trim();}
 if(input.date!==undefined){const date=input.date;if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00Z'))||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw new Error('Ngày dự tiệc riêng không hợp lệ.');result.date=date;}
 if(input.time!==undefined){if(typeof input.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))throw new Error('Giờ dự tiệc riêng không hợp lệ.');result.time=input.time;}
 if(input.mapUrl!==undefined){if(typeof input.mapUrl!=='string'||input.mapUrl.length>2048)throw new Error('Link bản đồ riêng không hợp lệ.');const value=input.mapUrl.trim();if(value){try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw new Error();}catch{throw new Error('Link bản đồ riêng cần là HTTPS hợp lệ.');}}result.mapUrl=value;}
 for(const key of ['photoScale','photoX','photoY'] as const){if(input[key]===undefined)continue;const number=input[key],min=key==='photoScale'?100:0,max=key==='photoScale'?250:100;if(typeof number!=='number'||!Number.isFinite(number)||number<min||number>max)throw new Error('Kích thước hoặc vị trí ảnh không hợp lệ.');result[key]=number;}
 return result;
}
export function readGuestPresentation(value:unknown):GuestPresentation{
 try{const {mapQr,...fields}=typeof value==='string'?JSON.parse(value):value??{};const result=validateGuestPresentation(fields);if(mapQr&&typeof mapQr.url==='string'&&typeof mapQr.image==='string'&&/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(mapQr.image))result.mapQr=mapQr;return result;}catch{return {};}
}
export function applyGuestPresentation(wedding:Wedding,presentation:GuestPresentation={}):Wedding{return {...wedding,...presentation,mapUrl:presentation.mapUrl??(presentation.venue!==undefined||presentation.address!==undefined?'':wedding.mapUrl)};}
export function guestWithPresentation<T extends {presentation?:unknown}>(guest:T){return {...guest,presentation:readGuestPresentation(guest.presentation)};}
