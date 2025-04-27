import path from "node:path";

import dotenv from "dotenv";

dotenv.config({ path: path.resolve(".env") });

export const settings = {
  dbPassword: process.env.POSTGRES_PASSWORD,
  dbUsername: process.env.POSTGRES_USER,
  dbName: process.env.POSTGRES_DB,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,

  env: process.env.NODE_ENV || "development",
  tokenSecret: process.env.TOKEN_SECRET,

  port: process.env.PORT,
};

const validateSettings = () => {
  for (const [key, value] of Object.entries(settings)) {
    if (value === undefined) {
      throw new Error(`.env doesn't have ${key}`);
    }
  }
};

validateSettings();
