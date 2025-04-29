import { HttpError } from "../helpers/HttpError.js";

export const validateQueryString = (schema) => {
  const func = (req, _, next) => {
    const { value, error } = schema.validate(req.query, {
      convert: true,
      stripUnknown: true,
    });

    if (error) {
      next(HttpError(400, error.message));
    }

    Object.assign(req.query, value);

    next();
  };

  return func;
};
