'use client';
import { appPath } from '@/lib/paths';
import { useEffect,useState } from 'react';
export default function PasswordForm({mode}:{mode:'setup'|'change'}){
 const [token,setToken]=useState(''),[ready,setReady]=useState(mode==='change'),[checking,setChecking]=useState(false),[serverReady,setServerReady]=useState(mode==='change');
 const [password,setPassword]=useState(''),[confirmation,setConfirmation]=useState(''),[currentPassword,setCurrentPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const usable=mode==='change'||/^[a-f0-9]{64}$/.test(token);
 async function checkLink(value:string){
  setChecking(true);setServerReady(false);setError('');
  try{const r=await fetch(appPath('/api/auth/setup/check'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:value})});const data=await r.json() as {ready?:boolean;error?:string};if(!r.ok||!data.ready)throw new Error(data.error||'Chưa kiểm tra được link thiết lập.');setServerReady(true);}catch(e){setError((e as Error).message);}finally{setChecking(false);}
 }
 useEffect(()=>{if(mode==='setup'){const value=new URLSearchParams(location.hash.slice(1)).get('token')??'';setToken(value);setReady(true);if(/^[a-f0-9]{64}$/.test(value))void checkLink(value);}},[mode]);
 async function submit(e:React.FormEvent){
  e.preventDefault();if(!serverReady)return;setError('');if(password!==confirmation){setError('Hai lần nhập mật khẩu chưa khớp.');return;}setBusy(true);
  try{const r=await fetch(appPath(mode==='setup'?'/api/auth/setup':'/api/auth/password'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,password,...(mode==='change'?{currentPassword}:{})})});const data=await r.json() as {error?:string};if(!r.ok)throw new Error(data.error||'Chưa lưu được mật khẩu.');setPassword('');setConfirmation('');setCurrentPassword('');if(mode==='setup')history.replaceState(null,'',location.pathname+location.search);window.location.assign(appPath('/'));}catch(e){setError((e as Error).message||'Chưa lưu được mật khẩu. Vui lòng thử lại.');}finally{setBusy(false);}
 }
 return <main className="closed-invite"><a className="brand" href={appPath("/")}>Lời Hẹn<span>✦</span></a><form className="admin-login" onSubmit={submit}>
  <h1>{mode==='setup'?'Tạo mật khẩu quản trị':'Đổi mật khẩu quản trị'}</h1>
  <p>{mode==='setup'?'Bạn không cần đăng nhập trước. Đặt mật khẩu cá nhân bằng link riêng để quản lý thiệp và khách mời.':'Nhập mật khẩu hiện tại và mật khẩu mới của bạn.'}</p>
  {ready&&!usable?<p className="notice">Hãy mở đầy đủ link thiết lập riêng đã được cấp cho bạn, gồm phần #token= ở cuối link.</p>:<>
   <input className="sr-only" tabIndex={-1} readOnly autoComplete="username" value="admin" aria-label="Tài khoản quản trị"/>
   {mode==='change'&&<label className="modal-label">Mật khẩu hiện tại<input type="password" required autoComplete="current-password" maxLength={256} value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/></label>}
   <label className="modal-label">Mật khẩu mới<input type="password" required autoComplete="new-password" minLength={8} maxLength={256} value={password} onChange={e=>setPassword(e.target.value)}/><span className="field-help">Từ 8 ký tự. Bạn có thể dùng một câu dễ nhớ.</span></label>
   <label className="modal-label">Nhập lại mật khẩu mới<input type="password" required autoComplete="new-password" minLength={8} maxLength={256} value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>
   {error&&<p className="notice error" role="alert">{error}</p>}
   {mode==='setup'&&usable&&!serverReady&&!checking&&<button className="button outline full-width" type="button" onClick={()=>void checkLink(token)}>Kiểm tra lại link</button>}
   <button className="button primary full-width" disabled={!ready||!usable||!serverReady||checking||busy}>{checking?'Đang kiểm tra link…':busy?'Đang lưu…':mode==='setup'?'Lưu mật khẩu & vào quản trị':'Lưu mật khẩu mới'}</button>
  </>}
  <a href={appPath(mode==='setup'?'/login':'/')}>{mode==='setup'?'Đã có mật khẩu? Đăng nhập':'Quay lại quản lý thiệp'}</a>
 </form></main>;
}
