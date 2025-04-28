import { sequelize, verifySequelizeConnection } from "./sequelize.js";

const sync = async () => {
  try {
    await verifySequelizeConnection();
    await sequelize.sync({ force: true });
  } catch (error) {
    await sequelize.close();
    process.exit(1);
  }
};

sync();
