import { NextResponse } from 'next/server';
import { conectarMongoDB } from '@/lib/mongodb';
export async function GET() {
  try {
    await conectarMongoDB();
    return NextResponse.json({ sucesso: true, mensagem: 'Conexão com MongoDB estabelecida.' });
  } catch {
    return NextResponse.json({ sucesso: false, mensagem: 'Falha ao conectar ao MongoDB.' }, { status: 500 });
  }
}
