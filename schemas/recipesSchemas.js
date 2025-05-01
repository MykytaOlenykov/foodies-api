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

const ingredientSchema = Joi.object({
  id: Joi.number().integer().required(),
  measure: Joi.string().trim().max(200).required(),
});

export const createRecipeBodySchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  categoryId: Joi.number().integer().required(),
  areaId: Joi.number().integer().required(),
  description: Joi.string().trim().max(200).required(),
  instructions: Joi.string().trim().max(200).required(),
  time: Joi.number().integer().required(),
  ingredients: Joi.array().items(ingredientSchema).min(1).required(),
});

export const deleteRecipeParamsSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});
