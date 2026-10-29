import { NextResponse } from 'next/server';
export async function POST() {
  const resposta = NextResponse.json({ sucesso: true, mensagem: 'Você saiu do sistema.' });
  resposta.cookies.set('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return resposta;
}
