require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('Configure MONGODB_URI no arquivo .env.local');
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.collection('usuarios');
    const email = 'coordenador@polyglot.com';
    const senha = 'Polyglot@2026';
    const existente = await col.findOne({ email });
    const hash = await bcrypt.hash(senha, 12);
    if (existente) {
      await col.updateOne({ _id: existente._id }, { $set: { tipo: 'coordenador', ativo: true, senha: hash } });
      console.log('Conta coordenadora atualizada.');
    } else {
      await col.insertOne({ nome: 'Coordenador Polyglot', email, senha: hash, tipo: 'coordenador', ativo: true, createdAt: new Date(), updatedAt: new Date() });
      console.log('Conta coordenadora criada.');
    }
    console.log('E-mail:', email);
    console.log('Senha:', senha);
  } catch (e) {
    console.error('Erro:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
main();
