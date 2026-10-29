import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  idioma: { type: String, required: true, enum: ['Inglês','Espanhol','Francês','Alemão','Italiano','Japonês','Mandarim','Português'] },
  nivel: { type: String, required: true, enum: ['A1','A2','B1','B2','C1','C2'] },
  cargaHoraria: { type: Number, required: true, min: 1, max: 5000 },
  descricao: { type: String, trim: true, maxlength: 500, default: '' },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.models.Curso || mongoose.model('Curso', schema);
