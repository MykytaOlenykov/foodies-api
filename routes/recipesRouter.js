import express from "express";

import { recipesControllers } from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getFavoritesSchema, updateFavoriteSchema } from "../schemas/recipesSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

export const recipesRouter = express.Router();

recipesRouter.get(
    "/favorites",
    authenticate,
    validateQueryString(getFavoritesSchema),
    recipesControllers.getMyFavorites
);

recipesRouter.patch(
    "/:recipeId/favorite",
    authenticate,
    isEmptyBody,
    validateBody(updateFavoriteSchema),
    recipesControllers.updateFavoriteStatus
);
