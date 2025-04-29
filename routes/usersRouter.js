import express from "express";

import { usersControllers } from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

export const usersRouter = express.Router();

usersRouter.get("/:id", authenticate, usersControllers.getUserById);
