import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conectarMongoDB } from '@/lib/mongodb';
import { verificarPermissao } from '@/lib/autenticacao';
import Curso from '@/models/Curso';

export async function PUT(request, { params }) {
  const auth = await verificarPermissao(['coordenador']);
  if (!auth.autorizado) return auth.resposta;
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ mensagem: 'ID inválido.' }, { status: 400 });
    const d = await request.json();
    await conectarMongoDB();
    const curso = await Curso.findByIdAndUpdate(id, { nome: d.nome?.trim(), idioma: d.idioma, nivel: d.nivel, cargaHoraria: Number(d.cargaHoraria), descricao: d.descricao || '' }, { new: true, runValidators: true });
    if (!curso) return NextResponse.json({ mensagem: 'Curso não encontrado.' }, { status: 404 });
    return NextResponse.json({ mensagem: 'Curso atualizado.', curso });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível atualizar o curso.' }, { status: 400 });
  }
}
export async function DELETE(request, { params }) {
  const auth = await verificarPermissao(['coordenador']);
  if (!auth.autorizado) return auth.resposta;
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ mensagem: 'ID inválido.' }, { status: 400 });
    await conectarMongoDB();
    const curso = await Curso.findByIdAndDelete(id);
    if (!curso) return NextResponse.json({ mensagem: 'Curso não encontrado.' }, { status: 404 });
    return NextResponse.json({ mensagem: 'Curso excluído.' });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível excluir o curso.' }, { status: 500 });
  }
}
