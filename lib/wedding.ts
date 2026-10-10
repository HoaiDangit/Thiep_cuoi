export type Wedding = {groom:string;bride:string;date:string;time:string;venue:string;address:string;message:string;template:string;expires:string;orientation?:'portrait'|'landscape';photo?:string;photoMode?:'fade'|'overlay'|'frame';photoOpacity?:number;photoX?:number;photoY?:number};
export type Guest = {token:string;name:string;expires:number;revoked:number};
export const templates = [
 {id:'garden',name:'Lời hẹn trong vườn',category:'Lãng mạn',color:'#315448',description:'Một khu vườn, một lời hẹn trọn đời.'},
 {id:'classic',name:'Son sắt',category:'Truyền thống',color:'#7e2837',description:'Sắc đỏ của ngày vui, nét chữ trang trọng.'},
 {id:'minimal',name:'Chung một nhà',category:'Tối giản',color:'#303b4b',description:'Tinh giản từng nét, đầy đủ yêu thương.'},
 {id:'night',name:'Dưới ánh sao',category:'Hiện đại',color:'#1d2940',description:'Một đêm đáng nhớ, một khởi đầu mới.'},
 {id:'peach',name:'Nắng đầu mùa',category:'Lãng mạn',color:'#9a4a37',description:'Ấm áp và nhẹ nhàng như ngày đầu gặp gỡ.'},
 {id:'editorial',name:'Ngày của chúng mình',category:'Hiện đại',color:'#292b28',description:'Những khoảnh khắc đẹp, kể bằng hình ảnh.'},
 {id:'mist',name:'Sương ban mai',category:'Lãng mạn',color:'#7b8c87',description:'Ảnh tan nhẹ vào nền xanh sương.'},
 {id:'sunset',name:'Chiều thương',category:'Lãng mạn',color:'#b97558',description:'Sắc hoàng hôn hòa cùng kỷ niệm.'},
 {id:'ivory',name:'Ước hẹn tinh khôi',category:'Tối giản',color:'#a5906b',description:'Ảnh và giấy ngà, nhẹ nhàng thanh lịch.'},
 {id:'botanical',name:'Vườn yêu',category:'Lãng mạn',color:'#3f604c',description:'Nét lá và ảnh cưới trong khu vườn xanh.'},
 {id:'velvet',name:'Nhung đỏ',category:'Truyền thống',color:'#6d293c',description:'Chân dung hòa vào sắc đỏ trầm.'},
 {id:'moonlight',name:'Hẹn dưới trăng',category:'Hiện đại',color:'#32415f',description:'Ánh trăng và ảnh cưới trên nền đêm.'},
 {id:'rose',name:'Hồng dịu dàng',category:'Lãng mạn',color:'#bd7d8c',description:'Sắc hồng phấn ôm lấy khoảnh khắc.'},
 {id:'film',name:'Thước phim đôi mình',category:'Hiện đại',color:'#665744',description:'Khung ảnh mang nét ký ức điện ảnh.'}
];
export const sample:Wedding={groom:'Minh Anh',bride:'Ngọc Linh',date:'2026-12-20',time:'18:00',venue:'The Garden · Sảnh Lavender',address:'12 Nguyễn Văn Bảo, Gò Vấp, TP. Hồ Chí Minh',message:'Một hành trình mới bắt đầu. Chúng mình rất mong được cùng bạn chia sẻ niềm vui trong ngày đặc biệt này.',template:'garden',expires:'2026-12-27'};
export function prettyDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)?date.split('-').reverse().join('.'):'Chưa chọn ngày';}
export function expiryTime(date:string){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return NaN;const noon=new Date(date+'T12:00:00Z');if(!Number.isFinite(noon.getTime())||noon.toISOString().slice(0,10)!==date)return NaN;return Date.parse(`${date}T23:59:59+07:00`);}
export function status(g:Guest){return g.revoked?'Đã thu hồi':g.expires<=Date.now()?'Hết hạn':'Đang mở';}
