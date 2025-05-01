import Joi from "joi";

import { paginationSchema } from "./commonSchemas.js";

export const getAllAreasQueryStringSchema = paginationSchema.keys({
  name: Joi.string().allow("").optional(),
});
