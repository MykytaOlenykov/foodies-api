import { listCategories, countCategories } from "../services/categoriesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await countCategories();
  const result = await listCategories({ page, limit });

  res.json({ total, result });
};

export const categoriesControllers = {
  getAllCategories: ctrlWrapper(getAllCategories),
};