import { Op } from "sequelize";

import { Area } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

const listAreas = async (query) => {
  const { page = 1, limit = 10, name } = query;
  const offset = getOffset(page, limit);

  const where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };

  const { rows, count } = await Area.findAndCountAll({
    where,
    offset,
    limit,
    order: [["name", "ASC"]],
  });

  return { areas: rows, total: count };
};

export const areasServices = {
  listAreas,
};
