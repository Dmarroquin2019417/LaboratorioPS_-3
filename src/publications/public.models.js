import mongoose from 'mongoose';

const PublicacionSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria"],
  },
  texto: {
    type: String,
    required: [true, "El texto principal es obligatorio"],
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Publicacion', PublicacionSchema);
