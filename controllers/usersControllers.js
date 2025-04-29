import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { usersServices } from "../services/usersServices.js";

const registerController = async (req, res) => {
  const data = await usersServices.registerUser(req);

  res.status(201).json(data);
};

const loginController = async (req, res) => {
  const { token, user: newUser } = await usersServices.loginUser(req);

  res.json({
    token,
    user: {
      email: newUser.email,
    },
  });
};

const getAuthorizedUserInfoController = (req, res) => {
  const { email, name, avatarURL } = req.user;

  res.json({
    email,
    name,
    avatarURL,
  });
};

const getAuthorizedUserDetailInfoController = async (req, res) => {
  const data = await usersServices.getAuthorizedUserDetailInfo(req);

  res.json({
    ...data,
  });
};

const getUserDetailInfoController = async (req, res) => {
  const data = await usersServices.getUserDetailInfo(req);

  res.json({
    ...data,
  });
};

export const usersControllers = {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getAuthorizedUserInfoController: ctrlWrapper(getAuthorizedUserInfoController),
  getAuthorizedUserDetailInfoController: ctrlWrapper(
    getAuthorizedUserDetailInfoController
  ),
  getUserDetailInfoController: ctrlWrapper(getUserDetailInfoController),
};
