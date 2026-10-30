'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {getBrowserSupabase} from '../lib/supabase/browser';

export default function PasswordResetForm({successHref='/account/login',successLabel='Return to sign in',requestHref='/account/forgot-password',variant='member'}){
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [checking,setChecking]=useState(true);
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [message,setMessage]=useState('');

  useEffect(()=>{
    const supabase=getBrowserSupabase();
    if(!supabase){setMessage('Password recovery is not configured yet.');setChecking(false);return}
    let alive=true;
    const check=async()=>{
      const {data,error}=await supabase.auth.getUser();
      if(!alive)return;
      if(!error&&data?.user)setReady(true);
      setChecking(false);
    };
    check();
    const {data:listener}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!alive)return;
      if((event==='PASSWORD_RECOVERY'||event==='SIGNED_IN'||event==='TOKEN_REFRESHED')&&session?.user){setReady(true);setChecking(false)}
    });
    return()=>{alive=false;listener?.subscription?.unsubscribe()};
  },[]);

  async function submit(event){
    event.preventDefault();
    setMessage('');
    if(password.length<8){setMessage('Use at least 8 characters for your new password.');return}
    if(password!==confirmPassword){setMessage('The passwords do not match.');return}
    const supabase=getBrowserSupabase();
    if(!supabase){setMessage('Password recovery is not configured yet.');return}
    setBusy(true);
    const {error}=await supabase.auth.updateUser({password});
    if(error){setMessage(error.message);setBusy(false);return}
    await supabase.auth.signOut({scope:'local'}).catch(()=>null);
    setDone(true);
    setMessage('Your password has been updated. You can now sign in with the new password.');
    setBusy(false);
  }

  if(checking)return <div className={variant==='admin'?'adminMessage':'formStatus'}>Checking your recovery link…</div>;
  if(!ready&&!done)return <div className={variant==='admin'?'resetState adminMessage':'resetState formStatus'}>
    <b>This reset link is invalid or has expired.</b>
    <p>Request a new password reset email and use the newest link.</p>
    <Link href={requestHref}>Request another reset link →</Link>
  </div>;

  if(done)return <div className={variant==='admin'?'resetState adminMessage resetSuccess':'resetState formStatus resetSuccess'}>
    <b>Password updated successfully.</b>
    <p>{message}</p>
    <Link href={successHref}>{successLabel} →</Link>
  </div>;

  return <form onSubmit={submit} className={variant==='admin'?'resetForm adminResetForm':'resetForm'}>
    <label>New password
      <input type="password" autoComplete="new-password" minLength="8" value={password} onChange={e=>setPassword(e.target.value)} required/>
    </label>
    <label>Confirm new password
      <input type="password" autoComplete="new-password" minLength="8" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required/>
    </label>
    <small className="passwordHint">Use at least 8 characters. A longer unique passphrase is recommended.</small>
    <button className={variant==='admin'?'':'btn primary'} disabled={busy}>{busy?'Updating…':'Update Password'}</button>
    {message&&<div className={variant==='admin'?'adminMessage resetError':'formStatus resetError'}>{message}</div>}
  </form>;
}
