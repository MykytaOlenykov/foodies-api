import * as testimonialsService from "../services/testimonialsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllTestimonials = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const offset = (page - 1) * limit;

  const total = await testimonialsService.countTestimonials();
  const result = await testimonialsService.getAll({
    settings: { limit, offset },
  });

  res.json({ total, result });
};

const createTestimonial = async (req, res) => {
  const { id } = req.user; // user id from authenticate
  const { testimonial } = req.body;

  const newTestimonial = await testimonialsService.createTestimonial({
    testimonial,
    ownerId: id, // Sequelize connection with ownerId
  });

  res.status(201).json(newTestimonial);
};

export const testimonialsControllers = {
  getAllTestimonials: ctrlWrapper(getAllTestimonials),
  createTestimonial: ctrlWrapper(createTestimonial),
};