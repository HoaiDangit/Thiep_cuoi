export const honorifics = [
 {id:'',label:'Không thêm danh xưng',self:'chúng mình',recipient:'bạn'},
 {id:'anh',label:'Anh',self:'chúng em',recipient:'anh'},
 {id:'chi',label:'Chị',self:'chúng em',recipient:'chị'},
 {id:'em',label:'Em',self:'anh chị',recipient:'em'},
 {id:'co',label:'Cô',self:'chúng cháu',recipient:'cô'},
 {id:'chu',label:'Chú',self:'chúng cháu',recipient:'chú'},
 {id:'bac',label:'Bác',self:'chúng cháu',recipient:'bác'},
 {id:'di',label:'Dì',self:'chúng cháu',recipient:'dì'},
 {id:'cau',label:'Cậu',self:'chúng cháu',recipient:'cậu'},
 {id:'mo',label:'Mợ',self:'chúng cháu',recipient:'mợ'},
 {id:'thim',label:'Thím',self:'chúng cháu',recipient:'thím'},
 {id:'ong',label:'Ông',self:'chúng cháu',recipient:'ông'},
 {id:'ba',label:'Bà',self:'chúng cháu',recipient:'bà'},
 {id:'ban',label:'Bạn',self:'chúng mình',recipient:'bạn'},
 {id:'anh-chi',label:'Anh chị',self:'chúng em',recipient:'anh chị'},
 {id:'co-chu',label:'Cô chú',self:'chúng cháu',recipient:'cô chú'},
 {id:'ong-ba',label:'Ông bà',self:'chúng cháu',recipient:'ông bà'},
 {id:'gia-dinh',label:'Gia đình',self:'chúng tôi',recipient:'quý gia đình'},
] as const;
export type Honorific=typeof honorifics[number]['id'];
export function validHonorific(value:unknown):value is Honorific{return honorifics.some(h=>h.id===value);}
export function guestSalutation(name:string,id:Honorific=''){
 const h=honorifics.find(h=>h.id===id)??honorifics[0];
 if(!h.id)return name;
 return name.toLocaleLowerCase('vi').startsWith(h.label.toLocaleLowerCase('vi')+' ')?name:`${h.label} ${name}`;
}
export function guestWording(id:Honorific=''){return honorifics.find(h=>h.id===id)??honorifics[0];}
export function invitationMessage(message:string,id:Honorific=''){
 const h=guestWording(id);
 if(!id)return message.replace(/\{\{xung_ho\}\}/g,h.self).replace(/\{\{danh_xung\}\}/g,h.recipient);
 return message.replace(/\{\{xung_ho\}\}/g,h.self).replace(/\{\{danh_xung\}\}/g,h.recipient)
  .replace(/(^|[^\p{L}])(chúng mình|chúng tôi|chúng em|chúng cháu)(?=$|[^\p{L}])/giu,(_,before,word)=>before+(word[0]===word[0].toUpperCase()?h.self[0].toUpperCase()+h.self.slice(1):h.self))
  .replace(/(^|[^\p{L}])(bạn)(?=$|[^\p{L}])/giu,(match,before,word,offset,text)=>{
   if(/(?:tình|người)\s$/iu.test(text.slice(0,offset)+before)||/^\s+(?:bè|thân|hữu)(?=$|[^\p{L}])/iu.test(text.slice(offset+match.length)))return match;
   return before+(word[0]==='B'?h.recipient[0].toUpperCase()+h.recipient.slice(1):h.recipient);
  });
}
