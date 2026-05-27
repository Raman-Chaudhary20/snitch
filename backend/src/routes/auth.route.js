import { Router } from "express";
import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validator.js";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { googleCallback } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: process.env.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login" }),
  googleCallback
);

export default router;
