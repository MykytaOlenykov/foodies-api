import jsonwebtoken from "jsonwebtoken";

import { settings } from "../settings.js";

const sign = (payload, options) => {
  return jsonwebtoken.sign(payload, settings.tokenSecret, options);
};

const verify = (token) => {
  return jsonwebtoken.verify(token, settings.tokenSecret);
};

export const jwt = {
  sign,
  verify,
};
