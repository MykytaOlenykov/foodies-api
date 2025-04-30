import Joi from "joi";


export const querySchema = Joi.object({
  category: Joi.number().integer().optional(),
  area: Joi.number().integer().optional(),
  ingredient: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  sort: Joi.string().optional(),
});


export const popularSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
});


