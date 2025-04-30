import express from "express";

import { recipesControllers } from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { updateFavoriteByIdSchema, updateFavoriteSchema } from "../schemas/recipesSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { validateParams } from "../middlewares/validateParams.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

export const recipesRouter = express.Router();

recipesRouter.get("/favorites", authenticate, validateQueryString(paginationSchema), recipesControllers.getMyFavorites);

recipesRouter.patch(
    "/favorites/:recipeId",
    authenticate,
    validateParams(updateFavoriteByIdSchema),
    validateBody(updateFavoriteSchema),
    recipesControllers.updateFavoriteStatus
);
