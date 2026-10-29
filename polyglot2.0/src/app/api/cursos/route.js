import { NextResponse } from 'next/server';
import { conectarMongoDB } from '@/lib/mongodb';
import { verificarPermissao } from '@/lib/autenticacao';
import Curso from '@/models/Curso';

export async function GET() {
  const auth = await verificarPermissao();
  if (!auth.autorizado) return auth.resposta;
  try {
    await conectarMongoDB();
    const cursos = await Curso.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ cursos, total: cursos.length });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível consultar cursos.' }, { status: 500 });
  }
}
export async function POST(request) {
  const auth = await verificarPermissao(['coordenador']);
  if (!auth.autorizado) return auth.resposta;
  try {
    const d = await request.json();
    const nome = typeof d.nome === 'string' ? d.nome.trim() : '';
    const idiomas = ['Inglês','Espanhol','Francês','Alemão','Italiano','Japonês','Mandarim','Português'];
    const niveis = ['A1','A2','B1','B2','C1','C2'];
    if (nome.length < 2 || !idiomas.includes(d.idioma) || !niveis.includes(d.nivel) || !Number.isInteger(Number(d.cargaHoraria)) || Number(d.cargaHoraria) < 1 || Number(d.cargaHoraria) > 5000) {
      return NextResponse.json({ mensagem: 'Preencha nome, idioma, nível e carga horária corretamente.' }, { status: 400 });
    }
    await conectarMongoDB();
    const regex = new RegExp('^' + nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    if (await Curso.findOne({ nome: regex, idioma: d.idioma, nivel: d.nivel })) return NextResponse.json({ mensagem: 'Este curso já existe.' }, { status: 409 });
    const curso = await Curso.create({ nome, idioma: d.idioma, nivel: d.nivel, cargaHoraria: Number(d.cargaHoraria), descricao: d.descricao || '' });
    return NextResponse.json({ mensagem: 'Curso cadastrado.', curso }, { status: 201 });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível cadastrar o curso.' }, { status: 500 });
  }
}
