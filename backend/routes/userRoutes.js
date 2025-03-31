const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/UserController");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please use a valid email"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.signup
);

router.post("/login", userController.login);
router.post("/logout", authenticateJWT, userController.logout);

module.exports = router;
