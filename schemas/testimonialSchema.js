import Joi from "joi";
import j2s from "joi-to-swagger";

export const createTestimonialSchema = Joi.object({
  testimonial: Joi.string().min(5).max(255).required(),
});

const getAllTestimonialsResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    testimonials: Joi.array().items(
      Joi.object({
        id: Joi.number().example(1),
        testimonial: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        owner: Joi.object({
          id: Joi.number().example(1),
          name: Joi.string(),
        }),
      })
    ),
  }),
});

export const { swagger: getAllTestimonialsResponseSwagger } = j2s(
  getAllTestimonialsResponseSchema
);
