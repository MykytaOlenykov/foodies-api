import {
  listTestimonials,
  createTestimonial,
} from "../services/testimonialsServices.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllTestimonials = ctrlWrapper(async (req, res) => {
  const { page = 1, limit = 3 } = req.query;

  const { testimonials, total } = await listTestimonials({}, { page, limit });

  res.status(200).json({ total, result: testimonials });
});

export const createTestimonialController = ctrlWrapper(async (req, res) => {
  const { id } = req.user;
  const { testimonial } = req.body;

  const newTestimonial = await createTestimonial({
    testimonial,
    ownerId: id,
  });

  res.status(201).json(newTestimonial);
});
