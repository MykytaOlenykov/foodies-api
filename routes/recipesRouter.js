import express from "express";

import { validateQueryString } from "../middlewares/validateQueryString.js";
import { recipesControllers } from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { identifyUser } from "../middlewares/identifyUser.js";
import { validateParams } from "../middlewares/validateParams.js";
import { validateBody } from "../middlewares/validateBody.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import {
  updateFavoriteByIdSchema,
  getRecipesQueryStringSchema,
  getRecipeByIdParamsSchema,
  createRecipeBodySchema,
  deleteRecipeParamsSchema,
} from "../schemas/recipesSchemas.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

export const recipesRouter = express.Router();

recipesRouter.get(
  "/",
  identifyUser,
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
  identifyUser,
  validateParams(getRecipeByIdParamsSchema),
  recipesControllers.getRecipeById
);

recipesRouter.delete(
  "/:recipeId",
  authenticate,
  validateParams(deleteRecipeParamsSchema),
  recipesControllers.deleteRecipeById
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
