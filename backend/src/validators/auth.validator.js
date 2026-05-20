import { body, validationResult } from "express-validator";


function validationRequest (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const validateRegister = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("fullname")
    .isLength({ min: 3 })
    .withMessage("Full name cannot be empty"),

  body("contact")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be exactly 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Contact number must be a valid 10-digit number"),

  body("role")
    .isIn(["buyer", "seller"])
    .withMessage("Role must be either 'buyer' or 'seller'"),

  body("isSeller")
    .isBoolean()
    .withMessage("isSeller must be a boolean value"),

  validationRequest
];
