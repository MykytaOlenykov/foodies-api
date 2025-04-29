import express from "express";

import { authControllers } from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

export const authRouter = express.Router();

authRouter.post("/register", authControllers.register);

authRouter.post("/login", authControllers.login);

authRouter.get("/current", authenticate, authControllers.currentUser);
