import { UserFavoriteRecipe } from "../db/models/userFavoriteRecipes.js";
import { User } from "../db/models/users.js";
import { HttpError } from "../helpers/HttpError.js";

export const addFavorite = async (where) => await UserFavoriteRecipe.findOrCreate({ where });

export const removeFavorite = async (where) => await UserFavoriteRecipe.destroy({ where });

export const getUserFavoriteRecipes = async (userId, settings) => {
    const { page, limit, offset } = settings;

    const user = await User.findByPk(userId);
    if (!user) {
        throw HttpError(404, "User not found");
    }

    const favoriteRecipes = await user.getFavoriteRecipes({
        attributes: ["id", "title", "thumb", "description"],
        joinTableAttributes: [],
        offset,
        limit,
    });

    const total = await UserFavoriteRecipe.count({
        where: { userId },
    });

    return {
        total,
        favoriteRecipes,
    };
};
