'use client';
import {useState} from 'react';
import Link from 'next/link';
import {getBrowserSupabase} from '../lib/supabase/browser';

export default function PasswordResetRequest({redirectPath='/account/reset-password',backHref='/account/login',backLabel='Back to sign in',variant='member'}){
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(event){
    event.preventDefault();
    setMessage('');
    setError('');
    const supabase=getBrowserSupabase();
    if(!supabase){setError('Password recovery is not configured yet.');return}
    setBusy(true);
    try{
      const redirectTo=new URL(redirectPath,window.location.origin).toString();
      const {error:resetError}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo});
      if(resetError)throw resetError;
      setMessage('If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.');
    }catch(err){
      setError(err?.message||'We could not send the reset email. Please try again.');
    }finally{
      setBusy(false);
    }
  }

  const form=<form onSubmit={submit} className={variant==='admin'?'resetForm adminResetForm':'resetForm'}>
    <label>Email address
      <input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    </label>
    <button className={variant==='admin'?'':'btn primary'} disabled={busy}>{busy?'Sending…':'Send Reset Link'}</button>
    {message&&<div className={variant==='admin'?'adminMessage resetSuccess':'formStatus resetSuccess'}>{message}</div>}
    {error&&<div className={variant==='admin'?'adminMessage resetError':'formStatus resetError'}>{error}</div>}
    <div className="authHelp"><Link href={backHref}>← {backLabel}</Link></div>
  </form>;

  return form;
}
