import express from "express";

import { usersControllers } from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateParams } from "../middlewares/validateParams.js";
import { getUserByIdSchema } from "../schemas/usersSchemas.js";

export const usersRouter = express.Router();

usersRouter.get(
  "/:userId",
  authenticate,
  validateParams(getUserByIdSchema),
  usersControllers.getUserById
);
