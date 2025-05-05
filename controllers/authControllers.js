import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { authServices } from "../services/authServices.js";

const register = async (req, res) => {
  const { token, user } = await authServices.register(req.body);

  res.status(201).json({ data: { token, user } });
};

const login = async (req, res) => {
  const { token, user } = await authServices.login(req.body);

  res.status(200).json({
    data: { token, user },
  });
};

const currentUser = (req, res) => {
  const user = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    avatarURL: req.user.avatarURL,
  };

  res.status(200).json({
    data: { user },
  });
};

const logout = async (req, res) => {
  await authServices.logout(req.user);
  res.status(204).send();
};

export const authControllers = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
  logout: ctrlWrapper(logout),
};
