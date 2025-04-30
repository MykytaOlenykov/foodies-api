import {
  listTestimonials,
  createTestimonial,
} from "../services/testimonialsServices.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllTestimonials = ctrlWrapper(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { testimonials, total } = await listTestimonials({}, { page, limit });

  res.status(200).json({ data: { total, testimonials } });
});

export const createTestimonialController = ctrlWrapper(async (req, res) => {
  const { id } = req.user;

  const testimonial = await createTestimonial({
    testimonial: req.body.testimonial,
    ownerId: id,
  });

  res.status(201).json({ data: { testimonial } });
});
