import Studio from './studio';
import { getChatGPTUser } from './chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Page(){const u=await getChatGPTUser();return <Studio user={u?{name:u.displayName}:null}/>;}
