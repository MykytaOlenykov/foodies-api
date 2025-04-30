import { verifySecret, hashSecret } from "../helpers/hashing.js";
import { HttpError } from "../helpers/HttpError.js";
import { jwt } from "../helpers/jwt.js";
import { User } from "../db/sequelize.js";

const register = async (body) => {
  const { name, email, password } = body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await hashSecret(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  return { id: newUser.id, name: newUser.name, email: newUser.email };
};

const login = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await verifySecret(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, { expiresIn: "9h" });

  user.token = token;
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  };
};

const logout = async (user) => {
  await User.update({ token: null }, { where: { id: user.id } });
};

export const authServices = {
  register,
  login,
  logout,
};
