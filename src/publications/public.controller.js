import Publicacion from './public.models.js';
import { validationResult } from 'express-validator';


export const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find();
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error del servidor" });
    }
}


export const crearPublicacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { titulo, categoria, texto } = req.body;

    try {
        const nuevaPublicacion = new Publicacion({ titulo, categoria, texto, autor: req.usuario.id });
        await nuevaPublicacion.save();

        res.status(201).json({
            msg: "Publicación creada correctamente",
            nuevaPublicacion,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error del servidor" });
    }
}

export const actualizarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...rest } = req.body;

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        await Publicacion.findByIdAndUpdate(id, rest, { new: true });

        res.status(200).json({
            msg: "Publicación actualizada correctamente",
            publicacion,
        });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error del servidor" });
    }
};

export const eliminarPublicacion = async (req, res) => {
    const { id } = req.params;

    try {
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        await Publicacion.findByIdAndDelete(id);

        res.status(200).json({ msg: "Publicación eliminada correctamente" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error del servidor" });
    }
}
