import express from "express";

import { querySchema, popularSchema } from "../schemas/validateQueryString.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { recipesControllers } from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { updateFavoriteByIdSchema } from "../schemas/recipesSchemas.js";
import { validateParams } from "../middlewares/validateParams.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

export const recipesRouter = express.Router();

recipesRouter.get(
  "/",
  validateQueryString(querySchema),
  recipesControllers.getFilteredRecipes
);

recipesRouter.get(
  "/popular",
  validateQueryString(popularSchema),
  recipesControllers.getPopularRecipes
);

recipesRouter.get(
  "/favorites",
  authenticate,
  validateQueryString(paginationSchema),
  recipesControllers.getMyFavorites
);

recipesRouter.post(
  "/favorites/:recipeId",
  authenticate,
  validateParams(updateFavoriteByIdSchema),
  recipesControllers.addFavoriteRecipe
);

recipesRouter.delete(
  "/favorites/:recipeId",
  authenticate,
  validateParams(updateFavoriteByIdSchema),
  recipesControllers.removeFavoriteRecipe
);

recipesRouter.get("/:id", recipesControllers.getRecipeById);
