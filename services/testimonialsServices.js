import { Testimonial } from "../db/models/testimonials.js";
import { User } from "../db/models/users.js"; // to join with owner.name

export const getAll = async (search = {}) => {
  const {
    filter = {},
    settings = {},
  } = search;

  const { limit = 3, offset = 0 } = settings;

  return await Testimonial.findAll({
    where: filter,
    limit: Number(limit),
    offset: Number(offset),
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["name"],
      },
    ],
  });
};

export const countTestimonials = async () => {
  return await Testimonial.count();
};

export const createTestimonial = async (data) => {
  return await Testimonial.create(data);
};