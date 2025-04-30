import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { recipesServices } from "../services/recipesServices.js";
import { HttpError } from "../helpers/HttpError.js";

const getFilteredRecipes = async (req, res) => {
  const { category, ingredient, area, page = 1, limit = 10, sort } = req.query;
  const data = await recipesServices.getRecipes({ category, ingredient, area, page, limit, sort });
  res.json(data);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const data = await recipesServices.getOneRecipe({ id });

  if (!data) {
    throw HttpError(404, "Recipe not found");
  }

  res.json(data);
};

const getPopularRecipes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const data = await recipesServices.getPopularRecipes({ page, limit });
  res.json(data);
};

export const recipesController = {
  getFilteredRecipes: ctrlWrapper(getFilteredRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
};
