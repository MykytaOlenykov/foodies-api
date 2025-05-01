import { Router } from "express";
import { ingredientsControllers } from "../controllers/ingredientsControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { getAllIngredientsQueryStringSchema } from "../schemas/ingredientsSchemas.js";

const ingredientsRouter = Router();

ingredientsRouter.get(
  "/",
  validateQueryString(getAllIngredientsQueryStringSchema),
  ingredientsControllers.getAllIngredients
);

export { ingredientsRouter };
