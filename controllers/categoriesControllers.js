import { listCategories } from "../services/categoriesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllCategories = ctrlWrapper(async (req, res) => {
  const { categories, total } = await listCategories(req.query);

  res.status(200).json({ data: { total, categories } });
});
