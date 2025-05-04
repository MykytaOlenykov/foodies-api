import Joi from "joi";
import j2s from "joi-to-swagger";

import { paginationSchema } from "./commonSchemas.js";

export const updateFavoriteByIdSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});

export const getRecipeByIdParamsSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});

const getRecipeByIdResponseSchema = Joi.object({
  data: Joi.object({
    recipe: Joi.object({
      id: Joi.number().example(1),
      title: Joi.string(),
      instructions: Joi.string(),
      description: Joi.string(),
      thumb: Joi.string(),
      time: Joi.number().example(60),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      owner: Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
      }),
      area: Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
      }),
      category: Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
      }),
      ingredients: Joi.array().items(
        Joi.object({
          id: Joi.number().example(1),
          name: Joi.string(),
          measure: Joi.string(),
          imgURL: Joi.string(),
        })
      ),
    }),
  }),
});

export const { swagger: getRecipeByIdResponseSwagger } = j2s(
  getRecipeByIdResponseSchema
);

export const getRecipesQueryStringSchema = paginationSchema.keys({
  categoryId: Joi.number().integer().optional(),
  areaId: Joi.number().integer().optional(),
  ingredientId: Joi.number().integer().optional(),
  ownerId: Joi.number().integer().optional(),
});

export const { swagger: getRecipesQueryStringSwagger } = j2s(
  getRecipesQueryStringSchema
);

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

export const { swagger: createRecipeBodySwagger } = j2s(createRecipeBodySchema);

const createRecipeResponseSchema = Joi.object({
  data: Joi.object({
    recipe: Joi.object({
      id: Joi.number().example(1),
      title: Joi.string(),
      categoryId: Joi.number().example(1),
      areaId: Joi.number().example(1),
      description: Joi.string(),
      instructions: Joi.string(),
      time: Joi.number().example(60),
      thumb: Joi.string(),
      ownerId: Joi.number().example(1),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      recipeIngredients: Joi.array().items(
        Joi.object({
          recipeId: Joi.number().example(1),
          ingredientId: Joi.number().example(1),
          measure: Joi.string(),
        })
      ),
    }),
  }),
});

export const { swagger: createRecipeResponseSwagger } = j2s(
  createRecipeResponseSchema
);

export const deleteRecipeParamsSchema = Joi.object({
  recipeId: Joi.number().integer().required(),
});

const recipeSchema = Joi.object({
  id: Joi.number().example(1),
  title: Joi.string(),
  description: Joi.string(),
  thumb: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  owner: Joi.object({
    id: Joi.number().example(1),
    name: Joi.string(),
    avatarURL: Joi.string(),
  }),
});

const getRecipesResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    recipes: Joi.array().items(recipeSchema),
  }),
});

export const { swagger: getRecipesResponseSwagger } = j2s(
  getRecipesResponseSchema
);

const getPopularRecipesResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    popularRecipes: Joi.array().items(recipeSchema),
  }),
});

export const { swagger: getPopularRecipesResponseSwagger } = j2s(
  getPopularRecipesResponseSchema
);

const getFavoriteRecipesResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    favoriteRecipes: Joi.array().items(recipeSchema),
  }),
});

export const { swagger: getFavoriteRecipesResponseSwagger } = j2s(
  getFavoriteRecipesResponseSchema
);

const addFavoriteRecipeResponseSchema = Joi.object({
  data: Joi.object({
    message: Joi.string(),
  }),
});

export const { swagger: addFavoriteRecipeResponseSwagger } = j2s(
  addFavoriteRecipeResponseSchema
);
