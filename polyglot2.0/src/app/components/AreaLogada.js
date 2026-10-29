'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotaoSair from './BotaoSair';

const itens = [
  { href: '/', label: 'Painel', icon: '⌂', roles: ['coordenador','professor','aluno'] },
  { href: '/cursos', label: 'Cursos', icon: '▤', roles: ['coordenador','professor','aluno'] },
  { href: '/professores', label: 'Professores', icon: '♙', roles: ['coordenador'] },
  { href: '/turmas', label: 'Turmas', icon: '▦', roles: ['coordenador','professor'] },
  { href: '/alunos', label: 'Alunos', icon: '♧', roles: ['coordenador'] },
  { href: '/matriculas', label: 'Matrículas', icon: '✚', roles: ['coordenador'] },
  { href: '/notas-faltas', label: 'Notas e faltas', icon: '✓', roles: ['coordenador','professor'] },
  { href: '/boletim', label: 'Boletim', icon: '▣', roles: ['coordenador','professor','aluno'] }
];
export default function AreaLogada({ usuario, titulo, subtitulo, children }) {
  const pathname = usePathname();
  const iniciais = (usuario?.nome || 'U').split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const perfil = { coordenador:'Coordenação', professor:'Professor', aluno:'Aluno' }[usuario?.tipo] || 'Usuário';
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">P</div><div><strong>Polyglot</strong><small>Gestão acadêmica</small></div></div>
      <div className="nav-label">Menu principal</div>
      <nav className="nav">{itens.filter(i=>i.roles.includes(usuario?.tipo)).map(i=><Link key={i.href} href={i.href} className={pathname===i.href || (i.href!=='/' && pathname.startsWith(i.href))?'active':''}><span>{i.icon}</span>{i.label}</Link>)}</nav>
      <div className="sidebar-bottom"><div><strong>{usuario?.nome}</strong><br/><span>{perfil}</span></div><BotaoSair /></div>
    </aside>
    <main className="main">
      <div className="topbar"><div className="crumb">Polyglot / {titulo}</div><div className="user-chip"><div className="avatar">{iniciais}</div><div><strong>{usuario?.nome}</strong><small>{perfil}</small></div></div></div>
      {subtitulo ? <><h1>{titulo}</h1><p className="subtitle">{subtitulo}</p></> : null}
      {children}
    </main>
  </div>;
}
