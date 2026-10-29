import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
import { conectarMongoDB } from '@/lib/mongodb';
import Usuario from '@/models/Usuario';
import AreaLogada from '../components/AreaLogada';
import ListaAlunos from '../components/ListaAlunos';
async function Conteudo(){const usuario=await obterUsuarioAutenticado();if(!usuario)redirect('/login');if(usuario.tipo!=='coordenador')redirect('/');await conectarMongoDB();const alunos=await Usuario.find({tipo:'aluno'}).select('nome email ativo createdAt').sort({createdAt:-1}).lean();return <AreaLogada usuario={usuario} titulo="Alunos" subtitulo="Consulte as contas de alunos cadastradas na plataforma."><ListaAlunos alunos={JSON.parse(JSON.stringify(alunos.map(a=>({...a,_id:a._id.toString()}))))}/></AreaLogada>}
export default function AlunosPage(){return <Suspense fallback={<main className="main">Carregando alunos...</main>}><Conteudo/></Suspense>}
