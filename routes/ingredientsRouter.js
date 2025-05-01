import { Router } from "express";
import { getAllIngredients } from "../controllers/ingredientsControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { getAllIngredientsQueryStringSchema } from "../schemas/ingredientsSchemas.js";

const ingredientsRouter = Router();

ingredientsRouter.get(
  "/",
  validateQueryString(getAllIngredientsQueryStringSchema),
  getAllIngredients
);

export { ingredientsRouter };
