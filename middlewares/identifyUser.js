import { jwt } from "../helpers/jwt.js";
import { User } from "../db/sequelize.js";

export const identifyUser = async (req, _, next) => {
  try {
    req.user = null;

    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return next();
    }

    const { id } = jwt.verify(token);

    if (!id) {
      return next();
    }

    const user = await User.findByPk(id);

    if (!user || !user.token || user.token !== token) {
      return next();
    }

    req.user = user;

    next();
  } catch (error) {
    next();
  }
};
