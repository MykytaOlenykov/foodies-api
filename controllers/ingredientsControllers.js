import { listIngredients } from "../services/ingredientsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllIngredients = ctrlWrapper(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { ingredients, total } = await listIngredients({}, { page, limit });

  res.status(200).json({ total, result: ingredients });
});
