import path from "node:path";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { areasRouter } from "./routes/areasRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { categoriesRouter } from "./routes/categoriesRouter.js";
import { ingredientsRouter } from "./routes/ingredientsRouter.js";
import { recipesRouter } from "./routes/recipesRouter.js";
import { testimonialsRouter } from "./routes/testimonialsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { sequelize, verifySequelizeConnection } from "./db/sequelize.js";
import { settings } from "./settings.js";
import { swaggerOptions } from "./swagger.js";

const app = express();
const staticPath = path.join(process.cwd(), "public");

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/api/static", express.static(staticPath));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.use("/api/areas", areasRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/users", usersRouter);

app.get("/api/ok", (_, res) => {
  res.status(200).json({ message: "ok" });
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

(async () => {
  try {
    await verifySequelizeConnection();

    const port = settings.port ?? 9000;
    app.listen(port);

    console.log(`Server is running. Use our API on port: ${port}`);
  } catch (error) {
    await sequelize.close();
    console.log(error);
    process.exit(1);
  }
})();
