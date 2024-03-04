import { Router } from "express";
import { check } from "express-validator";
import { createComment, editComment, eliminarComentario, getCommentsWithPublications } from "../coments/coments.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT, // Verifica si el usuario está autenticado
    check("comentario", "El comentario es obligatorio").not().isEmpty(),
    check("publicacion", "El ID de la publicación es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createComment
);

router.get("/", getCommentsWithPublications);

router.put(
  "/:id",
  [
    validarJWT, // Verifica si el usuario está autenticado
    check("comentario", "El comentario es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  editComment
);

router.delete("/:id", [validarJWT, validarCampos], eliminarComentario);

export default router;