import { NextResponse } from 'next/server';
import { obterUsuarioAutenticado } from '@/lib/autenticacao';
export async function GET() {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario) return NextResponse.json({ mensagem: 'Não autenticado.' }, { status: 401 });
  return NextResponse.json({ usuario });
}
