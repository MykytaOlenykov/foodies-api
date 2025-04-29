import express from "express";

import { usersControllers } from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

export const usersRouter = express.Router();

usersRouter.post("/register", usersControllers.registerController);
usersRouter.post("/login", usersControllers.loginController);
usersRouter.get(
  "/currentUserInfo",
  authenticate,
  usersControllers.getAuthorizedUserInfoController
);
usersRouter.get(
  "/currentUserDetailInfo",
  authenticate,
  usersControllers.getAuthorizedUserDetailInfoController
);

usersRouter.get(
  "/userDetailInfo/:userId",
  authenticate,
  usersControllers.getUserDetailInfoController
);
