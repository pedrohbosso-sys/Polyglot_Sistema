import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
import AreaLogada from '../components/AreaLogada';
import ModuloRegistros from '../components/ModuloRegistros';
async function Conteudo() {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario) redirect('/login');
  if (!["coordenador", "professor"].includes(usuario.tipo)) redirect('/');
  return <AreaLogada usuario={usuario} titulo="Notas e faltas" subtitulo="Registre avaliações, frequência e observações acadêmicas."><ModuloRegistros tipo="notas-faltas" /></AreaLogada>;
}
export default function Pagina() { return <Suspense fallback={<main className="main">Carregando módulo...</main>}><Conteudo /></Suspense>; }
