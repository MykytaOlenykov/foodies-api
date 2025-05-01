import { listIngredients } from "../services/ingredientsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllIngredients = ctrlWrapper(async (req, res) => {
  const { ingredients, total } = await listIngredients(req.query);

  res.status(200).json({ data: { total, ingredients } });
});
