import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
import AreaLogada from '../components/AreaLogada';
import Boletim from '../components/Boletim';
async function Conteudo(){const usuario=await obterUsuarioAutenticado();if(!usuario)redirect('/login');return <AreaLogada usuario={usuario} titulo="Boletim acadêmico" subtitulo="Acompanhe notas, frequência e desempenho acadêmico."><Boletim perfil={usuario.tipo}/></AreaLogada>}
export default function BoletimPage(){return <Suspense fallback={<main className="main">Carregando boletim...</main>}><Conteudo/></Suspense>}
