import express from "express";

import { usersControllers } from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

export const usersRouter = express.Router();

usersRouter.post("/register", usersControllers.registerController);

usersRouter.post("/login", usersControllers.loginController);

usersRouter.get(
  "/current",
  authenticate,
  usersControllers.getAuthorizedUserInfoController
);

usersRouter.get(
  "/:Id",
  authenticate,
  usersControllers.getUserDetailInfoController
);
