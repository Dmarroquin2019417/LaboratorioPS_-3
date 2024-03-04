import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js'; 

export const login = async (req, res) => {
    const { correo, nombre, password, oldPassword, newPassword } = req.body;

    try {
        let usuario;

        // Verificar si el usuario existe por correo o nombre de usuario
        usuario = await Usuario.findOne({ $or: [{ correo }, { nombre }] });

        if (!usuario) {
            return res.status(400).json({
                msg: "Credenciales incorrectas. El correo o nombre de usuario no existe en la base de datos",
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "El usuario no está activo",
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta",
            });
        }

        // Verificar y actualizar la contraseña si se proporciona la contraseña anterior y la nueva contraseña
        if (oldPassword && newPassword) {
            const validOldPassword = bcryptjs.compareSync(oldPassword, usuario.password);
            if (!validOldPassword) {
                return res.status(400).json({
                    msg: "La contraseña anterior es incorrecta",
                });
            }

            // Encriptar y actualizar la nueva contraseña
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(newPassword, salt);
            await usuario.save();
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: 'Login Exitoso!!!',
            usuario,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "Comuníquese con el administrador",
        });
    }
}
