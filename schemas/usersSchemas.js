import Joi from "joi";

export const getUserByIdSchema = Joi.object({
  userId: Joi.number().integer().required(),
});
