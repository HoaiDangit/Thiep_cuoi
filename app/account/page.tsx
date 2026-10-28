import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PasswordForm from '../password-form';
export const dynamic='force-dynamic';
export const metadata={title:'Đổi mật khẩu · Lời Hẹn',robots:{index:false,follow:false}};
export default async function Account(){if(!await getAuthUser())redirect('/login');return <PasswordForm mode="change"/>;}
