import Joi from "joi";
import j2s from "joi-to-swagger";

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const errorResponseSchema = Joi.object({
  message: Joi.string(),
});

export const { swagger: errorResponseSwagger } = j2s(errorResponseSchema);
