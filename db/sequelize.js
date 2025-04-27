import { Sequelize } from "sequelize";

import { settings } from "../settings.js";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: settings.dbUsername,
  password: settings.dbPassword,
  host: settings.dbHost,
  database: settings.dbName,
  port: settings.dbPort,
  dialectOptions: {
    ssl: true,
  },
});

export const verifySequelizeConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Unable to connect to the database.");
    throw error;
  }
};
