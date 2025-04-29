import express from "express";

import { recipesController } from "../controllers/recipesControllers.js";

export const recipesRouter = express.Router();

recipesRouter.get("/", recipesController.getFilteredRecipesController);

recipesRouter.get("/popular", recipesController.getPopularRecipesController);

recipesRouter.get("/:id", recipesController.getRecipeByIdController);
