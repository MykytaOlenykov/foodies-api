import { Op } from "sequelize";

import { Ingredient } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

export const listIngredients = async (query) => {
  const { page = 1, limit = 10, name } = query;
  const offset = getOffset(page, limit);

  const where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };

  const { rows, count } = await Ingredient.findAndCountAll({
    where,
    attributes: ["id", "name", "imgURL"],
    offset,
    limit,
    order: [["name", "ASC"]],
  });

  return { ingredients: rows, total: count };
};
