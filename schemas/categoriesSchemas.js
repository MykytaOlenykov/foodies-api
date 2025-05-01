import Joi from "joi";

import { paginationSchema } from "./commonSchemas.js";

export const getAllCategoriesQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});
