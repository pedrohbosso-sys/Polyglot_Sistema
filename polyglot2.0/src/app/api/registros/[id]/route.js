import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conectarMongoDB } from '@/lib/mongodb';
import { verificarPermissao } from '@/lib/autenticacao';
import Registro from '@/models/Registro';

export async function PUT(request, { params }) {
  const auth = await verificarPermissao();
  if (!auth.autorizado) return auth.resposta;
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ mensagem: 'ID inválido.' }, { status: 400 });
    const atual = await request.json();
    await conectarMongoDB();
    const existente = await Registro.findById(id);
    if (!existente) return NextResponse.json({ mensagem: 'Registro não encontrado.' }, { status: 404 });
    if (auth.usuario.tipo !== 'coordenador' && !(existente.tipo === 'notas' && auth.usuario.tipo === 'professor' && existente.professorId === auth.usuario.id)) {
      return NextResponse.json({ mensagem: 'Sem permissão para editar este registro.' }, { status: 403 });
    }
    const permitido = ['nome','email','telefone','cursoId','professorId','alunoId','turmaId','dataInicio','horario','status','nota','faltas','observacoes','ativo'];
    const dados = {};
    for (const k of permitido) if (atual[k] !== undefined) dados[k] = atual[k];
    if (dados.nota !== undefined && dados.nota !== null && (Number(dados.nota) < 0 || Number(dados.nota) > 10)) return NextResponse.json({ mensagem: 'A nota deve estar entre 0 e 10.' }, { status: 400 });
    const registro = await Registro.findByIdAndUpdate(id, dados, { new: true, runValidators: true });
    return NextResponse.json({ mensagem: 'Registro atualizado.', registro });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível atualizar o registro.' }, { status: 400 });
  }
}
export async function DELETE(request, { params }) {
  const auth = await verificarPermissao(['coordenador']);
  if (!auth.autorizado) return auth.resposta;
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ mensagem: 'ID inválido.' }, { status: 400 });
    await conectarMongoDB();
    const r = await Registro.findByIdAndDelete(id);
    if (!r) return NextResponse.json({ mensagem: 'Registro não encontrado.' }, { status: 404 });
    return NextResponse.json({ mensagem: 'Registro excluído.' });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível excluir o registro.' }, { status: 500 });
  }
}
