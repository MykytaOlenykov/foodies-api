import Area from "../db/models/areas.js";

export const listAreas = async (filter = {}, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  return await Area.findAll({
    where: filter,
    offset,
    limit: normalizedLimit,
    order: [["name", "ASC"]],
  });
};

export const countAreas = async () => {
  return await Area.count();
};