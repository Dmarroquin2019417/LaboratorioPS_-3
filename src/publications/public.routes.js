import { Router } from "express";
import { check } from "express-validator";
import { getPublicaciones, crearPublicacion, actualizarPublicacion, eliminarPublicacion } from "../publications/public.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";


const router = Router();

router.get("/", getPublicaciones);

router.post(
  "/",
  [
    validarJWT, // Verifica si el usuario está autenticado
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("texto", "El texto principal es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearPublicacion
);

router.put(
  "/:id",
  [
    validarJWT, // Verifica si el usuario está autenticado
    check("id", "No es un ID válido").isMongoId(),
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("texto", "El texto principal es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarPublicacion
);

router.delete("/:id", [validarJWT, check("id", "No es un ID válido").isMongoId(), validarCampos], eliminarPublicacion);

export default router;
