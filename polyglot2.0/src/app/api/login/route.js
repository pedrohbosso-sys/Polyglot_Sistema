import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { conectarMongoDB } from '@/lib/mongodb';
import Usuario from '@/models/Usuario';

export async function POST(request) {
  try {
    const dados = await request.json();
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const senha = typeof dados.senha === 'string' ? dados.senha : '';
    if (!email || !senha) return NextResponse.json({ mensagem: 'Informe e-mail e senha.' }, { status: 400 });
    if (!process.env.JWT_SECRET) return NextResponse.json({ mensagem: 'JWT_SECRET não configurado.' }, { status: 500 });
    await conectarMongoDB();
    const usuario = await Usuario.findOne({ email, ativo: true }).select('+senha');
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) return NextResponse.json({ mensagem: 'E-mail ou senha incorretos.' }, { status: 401 });
    const token = jwt.sign({ sub: usuario._id.toString(), tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '2h' });
    const resposta = NextResponse.json({ sucesso: true, usuario: { nome: usuario.nome, tipo: usuario.tipo } });
    resposta.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 7200 });
    return resposta;
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível entrar no sistema.' }, { status: 500 });
  }
}
