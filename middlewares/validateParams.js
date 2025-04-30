import { HttpError } from "../helpers/HttpError.js";

export const validateParams = (schema) => {
  const func = (req, _, next) => {
    const { value, error } = schema.validate(req.params, {
      convert: true,
    });

    if (error) {
      next(HttpError(400, error.message));
    }

    Object.assign(req.params, value);

    next();
  };

  return func;
};
