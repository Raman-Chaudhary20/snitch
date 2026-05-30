import { Router } from "express";
import { createProductController, getAllProductsController } from "../controllers/product.controller.js";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { validateProduct } from "../validators/product.validator.js";
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});
const router = Router();

router.post("/create", authenticateSeller, upload.array('images'), validateProduct, createProductController)

router.get("/get-all", authenticateSeller, getAllProductsController)

export default router;