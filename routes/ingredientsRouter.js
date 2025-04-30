import { Router } from "express";
import { ingredientsControllers } from "../controllers/ingredientsControllers.js";

const ingredientsRouter = Router();

ingredientsRouter.get("/", ingredientsControllers.getAllIngredients);

export { ingredientsRouter };