import { listIngredients, countIngredients } from "../services/ingredientsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllIngredients = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await countIngredients();
  const result = await listIngredients({}, { page, limit });

  res.json({ total, result });
};

export const ingredientsControllers = {
  getAllIngredients: ctrlWrapper(getAllIngredients),
};