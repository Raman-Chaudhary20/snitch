import { Router } from "express";
import { validateRegister } from "../validators/auth.validator.js";
import { registerController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateRegister, registerController);


export default router;