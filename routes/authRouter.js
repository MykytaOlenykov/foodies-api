import express from "express";

import { authControllers } from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.register
);

authRouter.post("/login", validateBody(loginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.currentUser);

authRouter.post("/logout", authenticate, authControllers.logout);
