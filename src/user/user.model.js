import mongoose from 'mongoose';

// Definir el esquema para el modelo de usuario
const UserSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  instagram:{
    type: String,
    required: [true, "El instagram es obligatoria"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  contraseñaAnterior: [{
    type: String,
    required: true
}]
});

// Modificar el método toJSON para excluir campos no deseados en la respuesta
UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

// Exportar el modelo de usuario
export default mongoose.model('User', UserSchema);
