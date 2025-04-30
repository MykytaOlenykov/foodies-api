import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { getOffset } from "../helpers/getOffset.js";
import { addFavorite, getUserFavoriteRecipes, removeFavorite } from "../services/recipesServices.js";

const getFavorites = async (req, res) => {
    const { id: userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = getOffset(page, limit);

    const data = await getUserFavoriteRecipes(userId, { page, limit, offset });

    res.status(200).json({ data });
};

const addFavoriteRecipe = async (req, res) => {
    const { id: userId } = req.user;
    const { recipeId } = req.params;

    await addFavorite({ userId, recipeId });

    res.status(201).json({ message: "Recipe added to favorites" });
};

const removeFavoriteRecipe = async (req, res) => {
    const { id: userId } = req.user;
    const { recipeId } = req.params;

    await removeFavorite({ userId, recipeId });

    res.status(204).json({ message: "Recipe removed from favorites" });
};

export const recipesControllers = {
    getMyFavorites: ctrlWrapper(getFavorites),
    addFavoriteRecipe: ctrlWrapper(addFavoriteRecipe),
    removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
};
