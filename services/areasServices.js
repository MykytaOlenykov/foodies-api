import { Area } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

export const listAreas = async (filter = {}, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const offset = getOffset(page, limit);

  const { rows, count } = await Area.findAndCountAll({
    where: filter,
    offset,
    limit,
    order: [["name", "ASC"]],
  });

  return { areas: rows, total: count };
};
