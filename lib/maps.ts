export function validMapUrl(value:unknown):value is string {
 if(typeof value!=='string'||value.length>2048)return false;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}
}
export function weddingMapUrl(w:{mapUrl?:string;venue:string;address:string}){
 const custom=w.mapUrl?.trim();
 if(custom&&validMapUrl(custom))return custom;
 const query=[w.venue,w.address].map(value=>value.trim()).filter(Boolean).join(' ');
 return query?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`:'';
}
