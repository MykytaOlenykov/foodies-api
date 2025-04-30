import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { recipesServices } from "../services/recipesServices.js";

const getFavorites = async (req, res) => {
  const { id: userId } = req.user;
  const { page, limit } = req.query;

  const { favoriteRecipes, total } =
    await recipesServices.getUserFavoriteRecipes(userId, {
      page,
      limit,
    });

  res.status(200).json({ data: { favoriteRecipes, total } });
};

const addFavoriteRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { recipeId } = req.params;

  await recipesServices.addFavorite({ userId, recipeId });

  res.status(200).json({ message: "Recipe added to favorites" });
};

const removeFavoriteRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { recipeId } = req.params;

  await recipesServices.removeFavorite({ userId, recipeId });

  res.status(200).json({ message: "Recipe removed from favorites" });
};

export const recipesControllers = {
  getMyFavorites: ctrlWrapper(getFavorites),
  addFavoriteRecipe: ctrlWrapper(addFavoriteRecipe),
  removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
};
