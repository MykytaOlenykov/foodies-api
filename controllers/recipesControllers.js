import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { recipesServices } from "../services/recipesServices.js";

const getFilteredRecipes = async (req, res) => {
  const { category, ingredient, area, page = 1, limit = 10, sort } = req.query;
  const data = await recipesServices.getRecipes({
    category,
    ingredient,
    area,
    page,
    limit,
    sort,
  });
  res.json(data);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const data = await recipesServices.getOneRecipe({ id });
  res.json(data);
};

const getPopularRecipes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const data = await recipesServices.getPopularRecipes({ page, limit });
  res.json(data);
};

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
  getFilteredRecipes: ctrlWrapper(getFilteredRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
  getMyFavorites: ctrlWrapper(getFavorites),
  addFavoriteRecipe: ctrlWrapper(addFavoriteRecipe),
  removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
};
