import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { getOffset } from "../helpers/getOffset.js";
import { getUserFavoriteRecipes, updateUserFavoriteStatus } from "../services/recipesServices.js";

const getFavorites = async (req, res) => {
    const { id: userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = getOffset(page, limit);

    const data = await getUserFavoriteRecipes(userId, { page, limit, offset });

    res.status(200).json({ data });
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
