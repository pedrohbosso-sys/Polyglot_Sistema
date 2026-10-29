import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  senha: { type: String, required: true, select: false },
  tipo: { type: String, enum: ['aluno', 'professor', 'coordenador'], default: 'aluno', required: true },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.models.Usuario || mongoose.model('Usuario', schema);
