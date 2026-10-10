import Studio from './studio';
import { getAuthUser } from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function Page(){const u=await getAuthUser();return <Studio user={u?{name:u.displayName}:null}/>;}
