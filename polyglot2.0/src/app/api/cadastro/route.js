import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { conectarMongoDB } from '@/lib/mongodb';
import Usuario from '@/models/Usuario';

export async function POST(request) {
  try {
    const dados = await request.json();
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const senha = typeof dados.senha === 'string' ? dados.senha : '';
    if (nome.length < 3 || nome.length > 100) return NextResponse.json({ mensagem: 'O nome deve ter entre 3 e 100 caracteres.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ mensagem: 'Informe um e-mail válido.' }, { status: 400 });
    if (senha.length < 8) return NextResponse.json({ mensagem: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
    await conectarMongoDB();
    if (await Usuario.findOne({ email })) return NextResponse.json({ mensagem: 'Este e-mail já está cadastrado.' }, { status: 409 });
    const usuario = await Usuario.create({ nome, email, senha: await bcrypt.hash(senha, 12), tipo: 'aluno' });
    return NextResponse.json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso!', usuario: { id: usuario._id.toString(), nome, email } }, { status: 201 });
  } catch (e) {
    if (e?.code === 11000) return NextResponse.json({ mensagem: 'Este e-mail já está cadastrado.' }, { status: 409 });
    return NextResponse.json({ mensagem: 'Não foi possível realizar o cadastro.' }, { status: 500 });
  }
}
