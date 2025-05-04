import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import { usersControllers } from "../controllers/usersControllers.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { paginationSchema } from "../schemas/commonSchemas.js";
import {
  getUserByIdSchema,
  getFollowersParamsSchema,
  followUserParamsSchema,
  unFollowUserParamsSchema,
} from "../schemas/usersSchemas.js";

export const usersRouter = express.Router();

usersRouter.patch(
  "/avatars",
  authenticate,
  imageUpload.single("avatar"),
  usersControllers.updateAvatar
);

usersRouter.get(
  "/following",
  authenticate,
  validateQueryString(paginationSchema),
  usersControllers.getFollowing
);

usersRouter.get(
  "/:userId",
  authenticate,
  validateParams(getUserByIdSchema),
  usersControllers.getUserById
);

usersRouter.post(
  "/following/:userId",
  authenticate,
  validateParams(followUserParamsSchema),
  usersControllers.followUser
);

usersRouter.delete(
  "/following/:userId",
  authenticate,
  validateParams(unFollowUserParamsSchema),
  usersControllers.unFollowUser
);

usersRouter.get(
  "/:userId/followers",
  authenticate,
  validateParams(getFollowersParamsSchema),
  validateQueryString(paginationSchema),
  usersControllers.getFollowers
);
