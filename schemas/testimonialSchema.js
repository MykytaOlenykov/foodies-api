import Joi from "joi";

export const createTestimonialSchema = Joi.object({
  testimonial: Joi.string().min(100).max(255).required(),
});
