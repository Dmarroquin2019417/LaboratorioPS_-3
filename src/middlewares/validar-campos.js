// Importar el módulo 'validationResult' de 'express-validator'
import { validationResult } from 'express-validator';

// Middleware para validar campos utilizando 'express-validator'
export const validarCampos = (req, res, next) => {
    // Obtener los errores de validación
    const errors = validationResult(req);
    
    // Verificar si existen errores
    if (!errors.isEmpty()) {
        // Responder con un código 400 y los errores de validación
        return res.status(400).json(errors);
    }

    // Si no hay errores, pasar al siguiente middleware
    next();
};
