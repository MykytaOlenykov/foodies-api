import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { imageUpload } from "../middlewares/imageUpload.js";
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

usersRouter.patch(
  "/avatars",
  authenticate,
  imageUpload.single("avatar"),
  usersControllers.updateAvatar
);

usersRouter.get(
  "/current/followers",
  authenticate,
  usersControllers.getCurrentFollowers
);

usersRouter.get(
  "/current/following",
  authenticate,
  usersControllers.getFollowing
);
