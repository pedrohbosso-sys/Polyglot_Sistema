import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
import AreaLogada from '../components/AreaLogada';
import ModuloCursos from '../components/ModuloCursos';
async function Conteudo(){const usuario=await obterUsuarioAutenticado();if(!usuario)redirect('/login');return <AreaLogada usuario={usuario} titulo="Cursos" subtitulo="Consulte os cursos de idiomas e gerencie o catálogo acadêmico."><ModuloCursos podeEditar={usuario.tipo==='coordenador'}/></AreaLogada>}
export default function CursosPage(){return <Suspense fallback={<main className="main">Carregando cursos...</main>}><Conteudo/></Suspense>}
