import express from "express";
import { querySchema } from "../schemas/validateQueryString.js";
import { recipesController } from "../controllers/recipesControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";

export const recipesRouter = express.Router();

recipesRouter.get("/", validateQueryString(querySchema), recipesController.getFilteredRecipes);

recipesRouter.get("/popular", recipesController.getPopularRecipes);

recipesRouter.get("/:id", recipesController.getRecipeById);
