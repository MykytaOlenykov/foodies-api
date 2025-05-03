import Joi from "joi";
import j2s from "joi-to-swagger";

import { paginationSchema } from "./commonSchemas.js";

export const getAllAreasQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});

export const { swagger: getAllAreasQueryStringSwagger } = j2s(
  getAllAreasQueryStringSchema
);

const getAllAreasResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    areas: Joi.array().items(
      Joi.object({
        id: Joi.number().example(1),
        name: Joi.string(),
      })
    ),
  }),
});

export const { swagger: getAllAreasResponseSwagger } = j2s(
  getAllAreasResponseSchema
);
