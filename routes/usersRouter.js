import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import { usersControllers } from "../controllers/usersControllers.js";
import { validateParams } from "../middlewares/validateParams.js";
import { getUserByIdSchema } from "../schemas/usersSchemas.js";

export const usersRouter = express.Router();

usersRouter.patch(
  "/avatars",
  authenticate,
  imageUpload.single("avatar"),
  usersControllers.updateAvatar
);

usersRouter.get("/followers", authenticate, usersControllers.getFollowers);

usersRouter.get("/following", authenticate, usersControllers.getFollowing);

usersRouter.get(
  "/:userId",
  authenticate,
  validateParams(getUserByIdSchema),
  usersControllers.getUserById
);

usersRouter.post(
  "/following/:userId",
  authenticate,
  usersControllers.followUser
);

usersRouter.delete(
  "/following/:userId",
  authenticate,
  usersControllers.unFollowUser
);
