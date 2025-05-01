import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { createTestimonialSchema } from "../schemas/testimonialSchema.js";
import { paginationSchema } from "../schemas/commonSchemas.js";
import { testimonialsControllers } from "../controllers/testimonialsControllers.js";

const testimonialsRouter = Router();

testimonialsRouter.get(
  "/",
  validateQueryString(paginationSchema),
  testimonialsControllers.getAllTestimonials
);

testimonialsRouter.post(
  "/",
  authenticate,
  validateBody(createTestimonialSchema),
  testimonialsControllers.createTestimonialController
);

export { testimonialsRouter };
