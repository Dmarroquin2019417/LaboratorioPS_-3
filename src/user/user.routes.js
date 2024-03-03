import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
} from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/", getUsers);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  getUserById
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("instagram", "Instagram es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createUser
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  updateUser
);

export default router;
