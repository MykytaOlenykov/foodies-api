import { User, Testimonial } from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";

export const listTestimonials = async (filter = {}, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const offset = getOffset(page, limit);

  const { rows, count } = await Testimonial.findAndCountAll({
    where: filter,
    attributes: { exclude: ["ownerId"] },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    include: [{ model: User, as: "owner", attributes: ["id", "name"] }],
  });

  return { testimonials: rows, total: count };
};

export const createTestimonial = async (data) => {
  return await Testimonial.create(data);
};
