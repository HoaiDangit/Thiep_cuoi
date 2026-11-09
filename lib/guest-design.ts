import { templates,type Wedding } from './wedding';
import { validPhotoPath } from './photo';
export type GuestDesign=Pick<Wedding,'template'|'orientation'|'photo'|'photoMode'|'photoOpacity'|'photoX'|'photoY'|'photoScale'>;
export function guestDesign(w:Wedding):GuestDesign{return {template:w.template,orientation:w.orientation??'portrait',photo:w.photo??'',photoMode:w.photoMode??'fade',photoOpacity:w.photoOpacity??70,photoX:w.photoX??50,photoY:w.photoY??50,photoScale:w.photoScale??100};}
export function validateGuestDesign(input:unknown):GuestDesign{
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Mẫu thiệp riêng không hợp lệ.');
 const v=input as Record<string,unknown>;if(Object.keys(v).some(k=>!['template','orientation','photo','photoMode','photoOpacity','photoX','photoY','photoScale'].includes(k)))throw new Error('Mẫu thiệp riêng có thông tin không được hỗ trợ.');
 if(typeof v.template!=='string'||!templates.some(t=>t.id===v.template))throw new Error('Mẫu thiệp không hợp lệ.');
 if(v.orientation!==undefined&&!['portrait','landscape'].includes(v.orientation as string))throw new Error('Khổ thiệp không hợp lệ.');
 if(v.photoMode!==undefined&&!['fade','overlay','frame'].includes(v.photoMode as string))throw new Error('Kiểu ảnh không hợp lệ.');
 if(v.photo!==undefined&&(typeof v.photo!=='string'||(v.photo!==''&&!validPhotoPath(v.photo))))throw new Error('Ảnh thiệp không hợp lệ.');
 for(const key of ['photoOpacity','photoX','photoY','photoScale']){const n=v[key];if(n!==undefined&&(typeof n!=='number'||!Number.isFinite(n)||n<(key==='photoScale'?100:0)||n>(key==='photoScale'?250:100)))throw new Error('Điều chỉnh ảnh không hợp lệ.');}
 return Object.fromEntries(Object.entries(v).filter(([,value])=>value!==undefined)) as GuestDesign;
}
