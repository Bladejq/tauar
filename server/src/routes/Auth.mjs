import passport from "passport";
import { Router } from "express";
import UserRepository from "../repositories/User.mjs";
import { body, validationResult } from "express-validator";
import CartRepository from "../repositories/Cart.mjs";
import AdminAuthService from "./AdminAuthService.mjs";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Email should be valid"),
  body("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must include at least 8 characters.")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage(
      "Password must include lowercase and uppercase letters, and numbers."
    ),
  body("firstname").notEmpty().withMessage("Firstname must be written"),
  body("lastname").notEmpty().withMessage("Lastname must be written"),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const newUser = await UserRepository.addUser(req.body);
    await CartRepository.createCart(newUser);
    req.login(newUser, function (err) {
      if (err) { return next(err); }
      return res.sendStatus(200);
    });
  }
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email should be valid"),
  body("password")
    .isLength({
      min: 8,
    })
    .withMessage("Passwor must include at least 8 characters."),
  passport.authenticate("local"),
  (request, response) => {
    return response.sendStatus(200);
  }
);

router.get("/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminAuthService.login(email, password);
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

router.post("/admin/register", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  try {
    const newAdmin = await AdminAuthService.register({ email, password, firstname, lastname });
    res.status(201).json({ success: true, admin: newAdmin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
