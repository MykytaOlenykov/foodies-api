import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { usersServices } from "../services/usersServices.js";

const registerController = async (req, res) => {
  const user = await usersServices.registerUser(req.body);

  res.status(201).json({ data: { user } });
};

const loginController = async (req, res) => {
  const { token, user } = await usersServices.loginUser(req.body);

  res.status(200).json({
    data: { token, user },
  });
};

const getAuthorizedUserInfoController = (req, res) => {
  const user = {
    email: req.user.email,
    name: req.user.name,
    avatarURL: req.user.avatarURL,
  };

  res.status(200).json({
    data: { user },
  });
};

const getUserDetailInfoController = async (req, res) => {
  const { id } = req.params;

  const user = await usersServices.getUserById(id, req.user);

  res.status(200).json({
    data: { user },
  });
};

export const usersControllers = {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getAuthorizedUserInfoController: ctrlWrapper(getAuthorizedUserInfoController),
  getUserDetailInfoController: ctrlWrapper(getUserDetailInfoController),
};
