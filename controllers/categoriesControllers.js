import { categoriesServices } from "../services/categoriesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllCategories = async (req, res) => {
  const { categories, total } = await categoriesServices.listCategories(
    req.query
  );

  res.status(200).json({ data: { total, categories } });
};

export const categoriesControllers = {
  getAllCategories: ctrlWrapper(getAllCategories),
};
