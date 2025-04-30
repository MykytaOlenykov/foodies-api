import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { getUserFavoriteRecipes, updateUserFavoriteStatus } from "../services/recipesServices.js";

const getFavorites = async (req, res) => {
    const { id: userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const favorites = await getUserFavoriteRecipes(userId, { page, limit, offset });

    res.status(200).json(favorites);
};

const updateFavoriteStatus = async (req, res, next) => {
    const { recipeId: recipeId } = req.params;
    const { favorite } = req.body;
    const { id: userId } = req.user;

    await updateUserFavoriteStatus({ userId, recipeId, favorite });

    res.status(200).json("Favorite status updated");
};

export const recipesControllers = {
    updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus),
    getMyFavorites: ctrlWrapper(getFavorites),
};
