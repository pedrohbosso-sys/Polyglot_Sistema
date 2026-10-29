import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
import { conectarMongoDB } from '@/lib/mongodb';
import Curso from '@/models/Curso';
import Registro from '@/models/Registro';
import Usuario from '@/models/Usuario';
import AreaLogada from './components/AreaLogada';
import Link from 'next/link';

async function Dashboard() {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario) redirect('/login');
  await conectarMongoDB();
  const [cursos, professores, turmas, alunos, matriculas] = await Promise.all([
    Curso.countDocuments(), Registro.countDocuments({tipo:'professores'}), Registro.countDocuments({tipo:'turmas'}),
    Usuario.countDocuments({tipo:'aluno',ativo:true}), Registro.countDocuments({tipo:'matriculas'})
  ]);
  const cards = [
    {href:'/cursos',icon:'▤',title:'Cursos',desc:'Idiomas, níveis e cargas horárias.'},
    {href:'/professores',icon:'♙',title:'Professores',desc:'Cadastro e informações dos docentes.'},
    {href:'/turmas',icon:'▦',title:'Turmas',desc:'Organização de turmas e horários.'},
    {href:'/alunos',icon:'♧',title:'Alunos',desc:'Consulte alunos cadastrados na plataforma.'},
    {href:'/matriculas',icon:'✚',title:'Matrículas',desc:'Acompanhe matrículas e inscrições.'},
    {href:usuario.tipo==='aluno'?'/boletim':'/notas-faltas',icon:'✓',title:usuario.tipo==='aluno'?'Meu boletim':'Notas e faltas',desc:'Desempenho, notas e frequência.'}
  ];
  return <AreaLogada usuario={usuario} titulo="Painel" subtitulo="Acompanhe as informações acadêmicas em um só lugar.">
    <section className="hero"><h1>Olá, {usuario.nome.split(' ')[0]}! 👋</h1><p>Bem-vindo ao Polyglot. Organize cursos, turmas e o acompanhamento acadêmico de forma simples.</p></section>
    {usuario.tipo==='coordenador'&&<div className="stats">
      {[['Cursos',cursos,'Cursos cadastrados'],['Professores',professores,'Docentes registrados'],['Turmas',turmas,'Turmas organizadas'],['Alunos',alunos,'Contas de alunos']].map(s=><div className="stat" key={s[0]}><span className="stat-label">{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small></div>)}
    </div>}
    <div className="section-head"><h2>Acesso rápido</h2></div><div className="cards">{cards.filter(c=>usuario.tipo==='coordenador'||(usuario.tipo==='professor'&&!['Professores','Alunos','Matrículas'].includes(c.title))||(usuario.tipo==='aluno'&&['Cursos','Meu boletim'].includes(c.title))).map(c=><Link className="card" href={c.href} key={c.href}><div className="card-icon">{c.icon}</div><h3>{c.title}</h3><p>{c.desc}</p><span className="card-link">Acessar módulo →</span></Link>)}</div>
    {usuario.tipo==='coordenador'&&<div className="section-head"><h2>Atalhos administrativos</h2></div>}
    {usuario.tipo==='coordenador'&&<div className="cards"><Link className="card" href="/matriculas"><h3>Gerenciar matrículas</h3><p>{matriculas} matrícula(s) registrada(s).</p><span className="card-link">Ver matrículas →</span></Link><Link className="card" href="/boletim"><h3>Boletim acadêmico</h3><p>Consulte os registros acadêmicos.</p><span className="card-link">Consultar boletim →</span></Link></div>}
  </AreaLogada>;
}
function Loading(){return <main className="main"><p>Carregando painel...</p></main>}
export default function Home(){return <Suspense fallback={<Loading/>}><Dashboard/></Suspense>}
