import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  tipo: { type: String, required: true, enum: ['professores','turmas','matriculas','notas'] },
  nome: { type: String, required: true, trim: true, maxlength: 160 },
  email: { type: String, trim: true, lowercase: true, default: '' },
  telefone: { type: String, trim: true, default: '' },
  cursoId: { type: String, default: '' },
  professorId: { type: String, default: '' },
  alunoId: { type: String, default: '' },
  turmaId: { type: String, default: '' },
  dataInicio: { type: String, default: '' },
  horario: { type: String, default: '' },
  status: { type: String, default: 'Ativo' },
  nota: { type: Number, min: 0, max: 10, default: null },
  faltas: { type: Number, min: 0, default: 0 },
  observacoes: { type: String, maxlength: 500, default: '' },
  ativo: { type: Boolean, default: true },
  criadoPor: { type: String, default: '' }
}, { timestamps: true });
schema.index({ tipo: 1, nome: 1 });
export default mongoose.models.Registro || mongoose.model('Registro', schema);
