import { testimonialsServices } from "../services/testimonialsServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllTestimonials = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { testimonials, total } = await testimonialsServices.listTestimonials(
    {},
    { page, limit }
  );

  res.status(200).json({ data: { total, testimonials } });
};

const createTestimonialController = async (req, res) => {
  const { id } = req.user;

  const testimonial = await testimonialsServices.createTestimonial({
    testimonial: req.body.testimonial,
    ownerId: id,
  });

  res.status(201).json({ data: { testimonial } });
};

export const testimonialsControllers = {
  getAllTestimonials: ctrlWrapper(getAllTestimonials),
  createTestimonialController: ctrlWrapper(createTestimonialController),
};
