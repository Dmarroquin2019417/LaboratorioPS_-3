import { Schema, model } from "mongoose";

const ComentarioSchema = new Schema({
    comentario: {
    type: String,
    required: [true, "El comentario es obligatorio"],
  },
  autor: {
    type: Schema.ObjectId,
    ref: 'User', 
    required: true,
  },
  publicacion: {
    type: Schema.ObjectId,
    ref: 'Public', 
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default model('Comentario', ComentarioSchema);
