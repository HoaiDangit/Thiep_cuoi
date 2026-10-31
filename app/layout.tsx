import { appPath } from '@/lib/paths';
import type { Metadata } from 'next';
import './globals.css';
import './collection-invitations.css';
export const metadata:Metadata={title:'Lời Hẹn · Thiệp cưới online',description:'Chọn mẫu, viết lời mời và gửi thiệp cưới riêng đến từng người thương.',icons:{icon:appPath('/favicon.svg'),shortcut:appPath('/favicon.svg')}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>;}
