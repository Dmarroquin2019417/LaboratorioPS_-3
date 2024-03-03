// Importar la biblioteca 'jsonwebtoken'
import jwt from 'jsonwebtoken';
// Importar el modelo de Usuario
import Usuario from '../user/user.model.js';

// Middleware para validar un token JWT en una petición
export const validarJWT = async (req, res, next) => {
    // Obtener el token de la cabecera de la petición
    const token = req.header("x-token");

    // Verificar si no hay token en la petición y devolver un error
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición",
        });
    }

    try {
        // Verificación del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario correspondiente al UID
        const usuario = await Usuario.findById(uid);

        // Verificar que el usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            });
        }

        // Verificar si el usuario está habilitado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado:false'
            });
        }

        // Agregar el usuario al objeto de solicitud (req) para su uso posterior
        req.usuario = usuario;

        // Llamar a la siguiente función en la cadena de middlewares
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no válido",
        });
    }
}
