import type { InvitationTextEditor,InvitationTextField } from '@/lib/guest-presentation';
const labels:Record<InvitationTextField,string>={name:'tên khách',message:'lời nhắn riêng',date:'ngày dự tiệc',time:'giờ dự tiệc',venue:'tên địa điểm',address:'địa chỉ'};
export default function InvitationText({value,field,onEdit}:{value:string;field:InvitationTextField;onEdit?:InvitationTextEditor}){
 return onEdit?<button type="button" className="invitation-editable-text" aria-label={`Sửa ${labels[field]} trên thiệp`} title={`Bấm để sửa ${labels[field]}`} onClick={()=>onEdit(field)}>{value||'Bấm để thêm lời nhắn'}</button>:<>{value}</>;
}
