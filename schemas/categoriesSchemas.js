import Joi from "joi";
import j2s from "joi-to-swagger";

import { paginationSchema } from "./commonSchemas.js";

export const getAllCategoriesQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});

export const { swagger: getAllCategoriesQueryStringSwagger } = j2s(
  getAllCategoriesQueryStringSchema
);

const getAllCategoriesResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    categories: Joi.array().items(
      Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
      })
    ),
  }),
});

export const { swagger: getAllCategoriesResponseSwagger } = j2s(
  getAllCategoriesResponseSchema
);
