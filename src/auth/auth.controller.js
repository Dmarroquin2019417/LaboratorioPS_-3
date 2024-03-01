import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js'; 

export const login = async (req, res) => {
    const { correo, nombreUsuario, password } = req.body;

    try {
        let usuario;

        // Verificar si el usuario existe por correo
        usuario = await Usuario.findOne({ correo });

        // Si no se encuentra por correo, intentar buscar por nombre de usuario
        if (!usuario && nombreUsuario) {
            usuario = await Usuario.findOne({ nombreUsuario });
        }

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

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: 'Login Ok!!!',
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
