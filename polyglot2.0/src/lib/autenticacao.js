import { cookies } from 'next/headers';
import { NextResponse, connection } from 'next/server';
import jwt from 'jsonwebtoken';
import { conectarMongoDB } from '@/lib/mongodb';
import Usuario from '@/models/Usuario';

export async function obterUsuarioAutenticado() {
  await connection();
  try {
    const store = await cookies();
    const token = store.get('token')?.value;
    if (!token || !process.env.JWT_SECRET) return null;
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    if (!dados || typeof dados !== 'object' || typeof dados.sub !== 'string' ||
        !['aluno', 'professor', 'coordenador'].includes(dados.tipo)) return null;
    await conectarMongoDB();
    const usuario = await Usuario.findById(dados.sub).select('nome email tipo ativo').lean();
    if (!usuario || !usuario.ativo || usuario.tipo !== dados.tipo) return null;
    return { id: usuario._id.toString(), nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
  } catch {
    return null;
  }
}

export async function exigirPerfil(perfis = []) {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario) return { autorizado: false, status: 401, mensagem: 'Entre na sua conta para continuar.' };
  if (perfis.length && !perfis.includes(usuario.tipo)) {
    return { autorizado: false, status: 403, mensagem: 'Seu perfil não tem permissão para esta ação.' };
  }
  return { autorizado: true, usuario };
}

export async function verificarPermissao(perfis = []) {
  const resultado = await exigirPerfil(perfis);
  if (!resultado.autorizado) {
    return { autorizado: false, resposta: NextResponse.json({ mensagem: resultado.mensagem }, { status: resultado.status }) };
  }
  return { autorizado: true, usuario: resultado.usuario };
}
