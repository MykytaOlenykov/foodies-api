import { Ingredient } from "../db/models/ingredients.js";

export const listIngredients = async (filter = {}, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  return await Ingredient.findAll({
    where: filter,
    limit: normalizedLimit,
    offset,
    order: [["name", "ASC"]],
  });
};

export const countIngredients = async () => {
  return await Ingredient.count();
};