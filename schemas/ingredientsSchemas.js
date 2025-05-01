import Joi from "joi";

import { paginationSchema } from "./commonSchemas.js";

export const getAllIngredientsQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});
