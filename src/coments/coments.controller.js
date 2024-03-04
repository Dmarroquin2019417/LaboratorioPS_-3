import Publicacion from '../publications/public.models.js';
import Comentario from '../coments/coments.models.js';
import { validationResult } from 'express-validator';
import { format } from 'date-fns';

export const getCommentsWithPublications = async (req, res) => {
  try {
    // Obtener todas las publicaciones
    const publicaciones = await Publicacion.find();

    // Array para almacenar las publicaciones con comentarios
    const publicacionesConComentarios = [];

    // Iterar sobre cada publicación
    for (const publicacion of publicaciones) {
      // Encontrar todos los comentarios asociados con la publicación actual
      const comentarios = await Comentario.find({ publicacion: publicacion._id });

      // Formatear los comentarios
      const formattedComments = comentarios.map(comment => ({
        _id: comment._id,
        comentario: comment.comentario,
        autor: comment.autor,
        fechaCreacion: format(new Date(comment.fechaCreacion), "dd/MM/yyyy HH:mm"),
      }));

      // Agregar la publicación actual con sus comentarios al array
      publicacionesConComentarios.push({
        publicacion: publicacion,
        comentarios: formattedComments
      });
    }

    // Responder con las publicaciones y sus comentarios
    res.status(200).json(publicacionesConComentarios);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error del servidor" });
  }
};


export const createComment = async (req, res) => {
  try {
    const { comentario, publicacion } = req.body;
    const autor = req.usuario._id; 

    const newComment = new Comentario({
      comentario,
      autor,
      publicacion,
    });

    await newComment.save();

    res.status(200).json({
      msg: "Comentario creado exitosamente" ,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el comentario" });
  }
};

export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;
    const userId = req.usuario._id;

    const comment = await Comentario.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (String(comment.autor) !== String(userId)) {
      return res.status(403).json({
        message: "No tienes permiso para editar este comentario",
      });
    }

    comment.comentario = comentario;
    await comment.save();

    res.status(200).json({
      msg: "Comentario editado exitosamente" ,
      comentario,
  });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar el comentario" });
  }
};

export const eliminarComentario = async (req, res) => {
  const { id } = req.params;


  try {
      const comentario = await Comentario.findById(id);
      if (!comentario) {
          return res.status(404).json({ msg: "Comentario no encontrado" });
      }

      await Comentario.findByIdAndDelete(id);

      res.status(200).json({ msg: "Comentario eliminado correctamente" });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error del servidor" });
  }
}

