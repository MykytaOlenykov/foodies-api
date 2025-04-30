import Joi from "joi";

export const createTestimonialSchema = Joi.object({
  testimonial: Joi.string().min(5).max(255).required(),
});
