import Joi from "joi";

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

export const getFavoritesSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});
