import Joi from "joi";
import j2s from "joi-to-swagger";

import { paginationSchema } from "./commonSchemas.js";

export const getAllIngredientsQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});

export const { swagger: getAllIngredientsQueryStringSwagger } = j2s(
  getAllIngredientsQueryStringSchema
);

const getAllIngredientsResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    ingredients: Joi.array().items(
      Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
        imgURL: Joi.string(),
      })
    ),
  }),
});

export const { swagger: getAllIngredientsResponseSwagger } = j2s(
  getAllIngredientsResponseSchema
);
