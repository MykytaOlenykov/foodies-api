import express from "express";

import { recipesControllers } from "../controllers/recipesControllers.js";

export const recipesRouter = express.Router();

recipesRouter.get("/", recipesControllers.getFilteredRecipesController);

recipesRouter.get("/popular", recipesControllers.getPopularRecipesController);

recipesRouter.get("/:id", recipesControllers.getRecipeByIdController);
