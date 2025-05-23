import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { recipesServices } from "../services/recipesServices.js";

const getRecipes = async (req, res) => {
  const { total, recipes } = await recipesServices.getRecipes(
    req.query,
    req.user
  );
  res.status(200).json({ data: { total, recipes } });
};

const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await recipesServices.getRecipeById(recipeId, req.user);
  res.status(200).json({ data: { recipe } });
};

const getPopularRecipes = async (req, res) => {
  const { page, limit } = req.query;
  const { total, popularRecipes } = await recipesServices.getPopularRecipes({
    page,
    limit,
  });
  res.status(200).json({ data: { popularRecipes, total } });
};

const getFavoriteRecipes = async (req, res) => {
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

  res.status(200).json({ data: { message: "Recipe added to favorites" } });
};

const removeFavoriteRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { recipeId } = req.params;

  await recipesServices.removeFavorite({ userId, recipeId });

  res.status(200).json({ data: { message: "Recipe removed from favorites" } });
};

const createRecipe = async (req, res) => {
  const recipe = await recipesServices.createRecipe({
    body: req.body,
    file: req.file,
    user: req.user,
  });
  res.status(201).json({ data: { recipe } });
};

const deleteRecipeById = async (req, res) => {
  await recipesServices.deleteRecipeById(req.params.recipeId, req.user);
  res.status(204).send();
};

export const recipesControllers = {
  getRecipes: ctrlWrapper(getRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
  getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
  addFavoriteRecipe: ctrlWrapper(addFavoriteRecipe),
  removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
  createRecipe: ctrlWrapper(createRecipe),
  deleteRecipeById: ctrlWrapper(deleteRecipeById),
};
