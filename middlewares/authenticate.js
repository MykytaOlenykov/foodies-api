import { jwt } from "../helpers/jwt.js";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../db/sequelize.js";

export const authenticate = async (req, _, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw HttpError(401);
    }

    const { id } = jwt.verify(token);
    console.log("id", id);
    if (!id) {
      throw HttpError(401);
    }

    const user = await User.findByPk(id);

    if (!user || !user.token || user.token !== token) {
      throw HttpError(401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
