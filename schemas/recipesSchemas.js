import Joi from "joi";

export const updateFavoriteByIdSchema = Joi.object({
    recipeId: Joi.number().integer().required(),
});
