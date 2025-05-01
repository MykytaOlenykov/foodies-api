import { Router } from "express";
import { getAllCategories } from "../controllers/categoriesControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { getAllCategoriesQueryStringSchema } from "../schemas/categoriesSchemas.js";

const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  validateQueryString(getAllCategoriesQueryStringSchema),
  getAllCategories
);

export { categoriesRouter };
