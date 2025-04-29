import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { usersServices } from "../services/usersServices.js";

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await usersServices.getUserById(userId, req.user);

  res.status(200).json({
    data: { user },
  });
};

import { HttpError } from "../helpers/HttpError.js";

const updateAvatar = async (req, res) => {
  const { id: userId } = req.user;

  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const updatedUser = await usersServices.updateUserAvatar(userId, req.file);

  res.json({
    status: "success",
    code: 200,
    data: {
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
    },
  });
};

const getCurrentFollowers = async (req, res) => {
  const { id: userId } = req.user;

  const followers = await usersServices.getUserFollowers(userId);

  res.status(200).json(followers);
};

const getFollowing = async (req, res) => {
  const { id: userId } = req.user;

  const following = await usersServices.getFollowing(userId);

  res.status(200).json(following);
};

export const usersControllers = {
  getUserById: ctrlWrapper(getUserById),
  updateAvatar: ctrlWrapper(updateAvatar),
  getCurrentFollowers: ctrlWrapper(getCurrentFollowers),
  getFollowing: ctrlWrapper(getFollowing),
};
