'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage(){
 const [email,setEmail]=useState(''),[senha,setSenha]=useState(''),[erro,setErro]=useState(''),[busy,setBusy]=useState(false);const router=useRouter();
 async function entrar(e){e.preventDefault();setBusy(true);setErro('');try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,senha})});const d=await r.json();if(!r.ok)throw new Error(d.mensagem||'Não foi possível entrar.');router.replace('/');router.refresh()}catch(e){setErro(e.message)}finally{setBusy(false)}}
 return <main className="auth-page"><section className="auth-box"><div className="auth-brand"><div className="brand-mark">P</div><div><strong style={{fontSize:22}}>Polyglot</strong><div className="muted">Gestão acadêmica</div></div></div><h1>Bem-vindo de volta!</h1><p className="subtitle">Entre para acessar sua área acadêmica.</p>{erro&&<div className="message error">{erro}</div>}<form onSubmit={entrar}><div className="field"><label>E-mail</label><input className="input" type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field"><label>Senha</label><input className="input" type="password" required autoComplete="current-password" value={senha} onChange={e=>setSenha(e.target.value)}/></div><button className="btn btn-primary" disabled={busy}>{busy?'Entrando...':'Entrar no sistema'}</button></form><div className="auth-foot">Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link></div></section></main>
}
