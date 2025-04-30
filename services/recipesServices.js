import { UserFavoriteRecipe, Recipe } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";
import { HttpError } from "../helpers/HttpError.js";

const addFavorite = async ({ userId, recipeId }) => {
  await UserFavoriteRecipe.findOrCreate({ where: { userId, recipeId } });
};

const removeFavorite = async ({ userId, recipeId }) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(404, "Recipe not found");

  await UserFavoriteRecipe.destroy({ where: { userId, recipeId } });
};

const getUserFavoriteRecipes = async (userId, settings) => {
  const { page = 1, limit = 10 } = settings;
  const offset = getOffset(page, limit);

  const { count, rows } = await Recipe.findAndCountAll({
    include: [
      {
        model: UserFavoriteRecipe,
        as: "userFavoriteRecipes",
        where: { userId },
        attributes: [],
        required: true,
      },
    ],
    attributes: ["id", "title", "thumb", "description"],
    offset,
    limit,
  });

  return { total: count, favoriteRecipes: rows };
};

export const recipesServices = {
  addFavorite,
  removeFavorite,
  getUserFavoriteRecipes,
};
