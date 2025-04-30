import Joi from "joi";

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

export const updateFavoriteByIdSchema = Joi.object({
    recipeId: Joi.number().integer().required(),
});
