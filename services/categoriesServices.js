import { Op } from "sequelize";
import { Category } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

export const listCategories = async (
  filter = {},
  pagination = {},
  sort = {}
) => {
  const { page = 1, limit = 10 } = pagination;
  const offset = getOffset(page, limit);

  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }

  const { rows, count } = await Category.findAndCountAll({
    where,
    offset,
    limit,
    order: [[sort.by || "name", sort.order || "ASC"]],
  });

  return { categories: rows, total: count };
};
