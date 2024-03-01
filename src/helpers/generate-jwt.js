// Importar la biblioteca 'jsonwebtoken'
import jwt from 'jsonwebtoken';

// Función para generar un JWT (JSON Web Token)
export const generarJWT = (uid = ' ') => {
    // Devolver una promesa para manejar la generación del token de forma asíncrona
    return new Promise((resolve, reject) => {
        // Crear el payload del token con el ID del usuario
        const payload = { uid };

        // Firmar el token con la clave secreta y configuraciones adicionales
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h' // Token expira en 1 hora
            },
            (err, token) => {
                // Si hay un error al generar el token, rechazar la promesa con un mensaje de error
                err ? (console.log(err), reject('No se pudo generar el token')) : resolve(token);
            }
        );
    });
}
