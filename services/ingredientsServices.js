import { Ingredient } from "../db/models/ingredients.js";
import { getOffset } from "../helpers/getOffset.js";

export const listIngredients = async (filter = {}, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const offset = getOffset(page, limit);

  const { rows, count } = await Ingredient.findAndCountAll({
    where: filter,
    attributes: ["id", "name", "imgURL"],
    offset,
    limit,
    order: [["name", "ASC"]],
  });

  return { ingredients: rows, total: count };
};
