import Category from "../db/models/categories.js";

export const listCategories = async (pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  return await Category.findAll({
    limit: normalizedLimit,
    offset,
    order: [["name", "ASC"]],
  });
};

export const countCategories = async () => {
  return await Category.count();
};