import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

// Obtiene la lista de usuarios paginada y con estado activo
export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        users,
    });
}

// Crea un nuevo usuario en la base de datos
export const createUser = async (req, res) => {
    try {
        const { nombre, correo, password, instagram } = req.body;
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const user = new User({ nombre, correo, password, instagram });

        const salt = bcryptjs.genSaltSync(); // Por defecto tiene 10 vueltas
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            msg: "Usuario creado correctamente",
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtiene un usuario por su ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, ...rest } = req.body;

        // Buscar el usuario por ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si se proporcionó la contraseña anterior y si coincide
        if (oldPassword) {
            const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'La contraseña anterior es incorrecta' });
            }
        }

        // Si se proporciona una nueva contraseña, encriptarla y actualizarla
        if (newPassword) {
            const salt = bcryptjs.genSaltSync(); // Por defecto tiene 10 vueltas
            rest.password = bcryptjs.hashSync(newPassword, salt);

            // Agregar la contraseña anterior a la lista de contraseñas anteriores
            if (!user.contraseñaAnterior) {
                user.contraseñaAnterior = [];
            }
            user.contraseñaAnterior.push(user.password);
        }

        // Actualizar el resto de la información del usuario
        const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });

        res.status(200).json({
            msg: 'Usuario Actualizado',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}