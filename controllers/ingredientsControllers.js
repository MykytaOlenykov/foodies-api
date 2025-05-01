import { ingredientsServices } from "../services/ingredientsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllIngredients = async (req, res) => {
  const { ingredients, total } = await ingredientsServices.listIngredients(
    req.query
  );

  res.status(200).json({ data: { total, ingredients } });
};

export const ingredientsControllers = {
  getAllIngredients: ctrlWrapper(getAllIngredients),
};
