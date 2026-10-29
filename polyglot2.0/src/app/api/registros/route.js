import { NextResponse } from 'next/server';
import { conectarMongoDB } from '@/lib/mongodb';
import { verificarPermissao } from '@/lib/autenticacao';
import Registro from '@/models/Registro';

const tipos = ['professores', 'turmas', 'matriculas', 'notas'];
const administrativos = ['professores', 'turmas', 'matriculas'];
export async function GET(request) {
  const auth = await verificarPermissao();
  if (!auth.autorizado) return auth.resposta;
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    if (!tipos.includes(tipo)) return NextResponse.json({ mensagem: 'Tipo de registro inválido.' }, { status: 400 });
    await conectarMongoDB();
    const filtro = { tipo };
    if (auth.usuario.tipo === 'aluno' && tipo === 'notas') filtro.alunoId = auth.usuario.id;
    if (auth.usuario.tipo === 'professor' && tipo === 'notas') filtro.professorId = auth.usuario.id;
    const registros = await Registro.find(filtro).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ registros, total: registros.length });
  } catch {
    return NextResponse.json({ mensagem: 'Não foi possível consultar os registros.' }, { status: 500 });
  }
}
export async function POST(request) {
  const auth = await verificarPermissao();
  if (!auth.autorizado) return auth.resposta;
  try {
    const d = await request.json();
    if (!tipos.includes(d.tipo)) return NextResponse.json({ mensagem: 'Tipo de registro inválido.' }, { status: 400 });
    if (administrativos.includes(d.tipo) && auth.usuario.tipo !== 'coordenador') return NextResponse.json({ mensagem: 'Somente a coordenação pode cadastrar este item.' }, { status: 403 });
    if (d.tipo === 'notas' && !['professor', 'coordenador'].includes(auth.usuario.tipo)) return NextResponse.json({ mensagem: 'Somente professores ou coordenação podem registrar notas e faltas.' }, { status: 403 });
    const nome = typeof d.nome === 'string' ? d.nome.trim() : '';
    if (nome.length < 2 || nome.length > 160) return NextResponse.json({ mensagem: 'Informe um nome válido.' }, { status: 400 });
    const dados = { ...d, nome, criadoPor: auth.usuario.id };
    if (d.tipo === 'notas') {
      const nota = d.nota === '' || d.nota === null || d.nota === undefined ? null : Number(d.nota);
      const faltas = Number(d.faltas ?? 0);
      if ((nota !== null && (!Number.isFinite(nota) || nota < 0 || nota > 10)) || !Number.isInteger(faltas) || faltas < 0) return NextResponse.json({ mensagem: 'A nota deve ficar entre 0 e 10 e as faltas devem ser inteiras não negativas.' }, { status: 400 });
      dados.nota = nota; dados.faltas = faltas;
      if (auth.usuario.tipo === 'professor') dados.professorId = auth.usuario.id;
    }
    await conectarMongoDB();
    const registro = await Registro.create(dados);
    return NextResponse.json({ mensagem: 'Registro salvo com sucesso.', registro }, { status: 201 });
  } catch (e) {
    if (e?.name === 'ValidationError') return NextResponse.json({ mensagem: 'Confira os campos preenchidos.' }, { status: 400 });
    return NextResponse.json({ mensagem: 'Não foi possível salvar o registro.' }, { status: 500 });
  }
}
