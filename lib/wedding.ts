import type { GuestPresentation } from './guest-presentation';
import type { Honorific } from './honorifics';
export type VenueKind='Nhà trai'|'Nhà gái'|'Nhà hàng'|'Khác';
export type Venue={kind?:VenueKind;venue:string;address:string;mapUrl?:string;mapQr?:{url:string;image:string}};
export type Wedding = {kind?:VenueKind;groom:string;bride:string;date:string;time:string;venue:string;address:string;mapUrl?:string;mapQr?:Venue['mapQr'];secondVenue?:Venue;defaultVenue?:1|2;message:string;template:string;expires:string;orientation?:'portrait'|'landscape';photo?:string;photoMode?:'fade'|'overlay'|'frame';photoOpacity?:number;photoScale?:number;photoX?:number;photoY?:number};
export const LINK_LIFETIME_DAYS=40;
export const LINK_LIFETIME_MS=LINK_LIFETIME_DAYS*24*60*60*1000;
export function guestExpiry(created=Date.now()){return created+LINK_LIFETIME_MS;}
export type Guest = {token:string;name:string;honorific?:Honorific;presentation?:GuestPresentation;expires:number;revoked:number;venue_id?:1|2;created?:number};
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
 {id:'film',name:'Thước phim đôi mình',category:'Hiện đại',color:'#665744',description:'Khung ảnh mang nét ký ức điện ảnh.'},
 {id:'vows',name:'Lời thề dưới tán cây',category:'Lãng mạn',color:'#354d38',description:'Ảnh tràn khung, ngày cưới lớn và lời hẹn giữa khu vườn.'},
 {id:'tide',name:'Hẹn cùng biển xanh',category:'Hiện đại',color:'#779aaf',description:'Sắc xanh dịu, ảnh cưới rộng và nét chữ thanh thoát.'},
 {id:'duet',name:'Hai nửa một lời hẹn',category:'Tối giản',color:'#c8bba6',description:'Ảnh và lời mời chia đôi trên nền giấy trắng tinh giản.'},
 {id:'arch',name:'Dưới vòm yêu thương',category:'Lãng mạn',color:'#b99a74',description:'Khung ảnh vòm, giấy màu kem và chi tiết ánh vàng.'},
 {id:'scarlet',name:'Duyên son ngày chung đôi',category:'Truyền thống',color:'#842637',description:'Viền đỏ son, dải ảnh kỷ niệm và lời mời trang trọng.'},
 {id:'cinema',name:'Bộ phim mang tên chúng mình',category:'Hiện đại',color:'#5b463a',description:'Tấm vé ngày cưới với khung phim và sắc nâu ấm.'},
 {id:'window',name:'Nắng bên ô cửa',category:'Tối giản',color:'#9ca88a',description:'Vòm cửa ngập nắng, nền giấy ngà và những nhành lá xanh.'},
 {id:'jade',name:'Ngọc lục ngày vu quy',category:'Truyền thống',color:'#173e32',description:'Xanh ngọc trầm, chữ hỷ và khung ảnh vòm thanh lịch.'},
 {id:'letter',name:'Thư gửi ngày chung đôi',category:'Lãng mạn',color:'#833b4b',description:'Đôi ảnh Polaroid, phong thư và dấu sáp đỏ mận.'},
 {id:'lily',name:'Lời yêu trên giấy hoa',category:'Lãng mạn',color:'#71858d',description:'Nét hoa trắng xanh, ảnh cưới viền giấy và lời mời dịu dàng.'},
 {id:'journal',name:'Nhật ký đôi mình',category:'Hiện đại',color:'#ad8b6e',description:'Album ảnh màu latte, lịch ngày cưới và từng trang kỷ niệm.'},
 {id:'ocean',isNew:true,name:'Biển hẹn ngày chung đôi',category:'Lãng mạn',color:'#8aabc2',description:'Ảnh tràn khung tan vào nền trắng, nét chữ xanh biển và ánh vàng.'},
 {id:'evergreen',isNew:true,name:'Lời hẹn xanh mãi',category:'Lãng mạn',color:'#354c35',description:'Ngày cưới xếp tầng trên ảnh cùng lời hẹn một đời xanh mãi.'},
 {id:'premiere',isNew:true,name:'Chuyện tình lên màn ảnh',category:'Hiện đại',color:'#202420',description:'Poster điện ảnh đen, tên đôi mình nổi bật và suất chiếu một đời.'},
 {id:'merlot',isNew:true,name:'Đỏ rượu ngày thành hôn',category:'Truyền thống',color:'#5a1727',description:'Nền đỏ rượu, ánh vàng dịu và bộ ba khung ảnh trang trọng.'},
 {id:'cover',isNew:true,name:'Tình yêu vừa bắt đầu',category:'Hiện đại',color:'#a6402f',description:'Bìa tạp chí đỏ đất, ảnh cưới lớn và chữ trắng giàu cảm xúc.'},
 {id:'harvest',isNew:true,name:'Mùa thu của đôi mình',category:'Tối giản',color:'#aa8159',description:'Ảnh panorama, bố cục tạp chí và album sắc thu ấm áp.'}

];
export const sample:Wedding={groom:'Minh Anh',bride:'Ngọc Linh',date:'2026-12-20',time:'18:00',venue:'The Garden · Sảnh Lavender',address:'12 Nguyễn Văn Bảo, Gò Vấp, TP. Hồ Chí Minh',message:'Một hành trình mới bắt đầu. Chúng mình rất mong được cùng bạn chia sẻ niềm vui trong ngày đặc biệt này.',template:'garden',expires:'2026-12-27'};
export function prettyDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)?date.split('-').reverse().join('.'):'Chưa chọn ngày';}
export function expiryTime(date:string){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return NaN;const noon=new Date(date+'T12:00:00Z');if(!Number.isFinite(noon.getTime())||noon.toISOString().slice(0,10)!==date)return NaN;return Date.parse(`${date}T23:59:59+07:00`);}
export function status(g:Guest){return g.revoked?'Đã thu hồi':g.expires<=Date.now()?'Hết hạn':'Đang mở';}
