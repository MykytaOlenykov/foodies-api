import Joi from "joi";

import { paginationSchema } from "./commonSchemas.js";

export const updateFavoriteByIdSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});

export const getRecipeByIdParamsSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});

export const getRecipesQueryStringSchema = paginationSchema.keys({
  categoryId: Joi.number().integer().optional(),
  areaId: Joi.number().integer().optional(),
  ingredientId: Joi.number().integer().optional(),
  ownerId: Joi.number().integer().optional(),
});
