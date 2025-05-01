import { Op } from "sequelize";

import { Category } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

const listCategories = async (query) => {
  const { page = 1, limit = 10, name } = query;
  const offset = getOffset(page, limit);

  const where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };

  const { rows, count } = await Category.findAndCountAll({
    where,
    offset,
    limit,
    order: [["name", "ASC"]],
  });

  return { categories: rows, total: count };
};

export const categoriesServices = {
  listCategories,
};
