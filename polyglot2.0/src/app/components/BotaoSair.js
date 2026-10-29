'use client';
import { useRouter } from 'next/navigation';
export default function BotaoSair() {
  const router = useRouter();
  async function sair() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }
  return <button className="btn btn-ghost" onClick={sair}>↪ Sair</button>;
}
