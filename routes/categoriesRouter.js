import { Router } from "express";
import { getAllCategories } from "../controllers/categoriesControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  validateQueryString(paginationSchema),
  getAllCategories
);

export { categoriesRouter };