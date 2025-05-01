import express from "express";

import { validateQueryString } from "../middlewares/validateQueryString.js";
import { recipesControllers } from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateBody } from "../middlewares/validateBody.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import {
  updateFavoriteByIdSchema,
  getRecipesQueryStringSchema,
  getRecipeByIdParamsSchema,
  createRecipeBodySchema,
} from "../schemas/recipesSchemas.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

export const recipesRouter = express.Router();

recipesRouter.get(
  "/",
  validateQueryString(getRecipesQueryStringSchema),
  recipesControllers.getRecipes
);

recipesRouter.post(
  "/",
  authenticate,
  validateBody(createRecipeBodySchema),
  imageUpload.single("thumb"),
  recipesControllers.createRecipe
);

recipesRouter.get(
  "/popular",
  validateQueryString(paginationSchema),
  recipesControllers.getPopularRecipes
);

recipesRouter.get(
  "/favorites",
  authenticate,
  validateQueryString(paginationSchema),
  recipesControllers.getFavoriteRecipes
);

recipesRouter.get(
  "/:recipeId",
  validateParams(getRecipeByIdParamsSchema),
  recipesControllers.getRecipeById
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
