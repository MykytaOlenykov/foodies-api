import express from "express";
import { testimonialsControllers } from "../controllers/testimonialsControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createTestimonialSchema } from "../schemas/testimonialSchema.js";
import { paginationSchema } from "../schemas/commonSchemas.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";

const testimonialsRouter = express.Router();

testimonialsRouter.get(
  "/",
  validateQueryString(paginationSchema),
  testimonialsControllers.getAllTestimonials
);

testimonialsRouter.post(
  "/",
  authenticate,
  validateBody(createTestimonialSchema),
  testimonialsControllers.createTestimonial
);

export { testimonialsRouter };
