import { listCategories } from "../services/categoriesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllCategories = ctrlWrapper(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    name,
    sort = "name",
    order = "ASC",
  } = req.query;

  const { categories, total } = await listCategories(
    { name }, // filter
    { page, limit }, // pagination
    { by: sort, order: order.toUpperCase() } // sorting
  );

  res.status(200).json({ data: { total, categories } });
});
