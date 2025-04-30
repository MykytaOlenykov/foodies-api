import { Router } from "express";
import { getAllIngredients } from "../controllers/ingredientsControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

const ingredientsRouter = Router();

ingredientsRouter.get(
  "/",
  validateQueryString(paginationSchema),
  getAllIngredients
);

export { ingredientsRouter };
