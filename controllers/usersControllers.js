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

  const { avatarURL } = await usersServices.updateUserAvatar(userId, req.file);

  res.status(200).json({ data: { avatarURL } });
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;

  const followers = await usersServices.getFollowers(userId);

  res.status(200).json({ data: { followers } });
};

const getFollowing = async (req, res) => {
  const { id: userId } = req.user;

  const following = await usersServices.getFollowing(userId);

  res.status(200).json({ data: { following } });
};

const followUser = async (req, res) => {
  const { userId: followId } = req.params;
  const { id: userId } = req.user;

  if (userId === followId) {
    throw HttpError(400, "You can't follow yourself");
  }

  const followUser = await usersServices.followUser(userId, followId);

  res.status(201).json({ message: "The user has been followed" });
};

const unFollowUser = async (req, res) => {
  const { userId: followId } = req.params;
  const { id: userId } = req.user;

  if (userId === followId) {
    throw HttpError(400, "You can't unfollow yourself");
  }
  await usersServices.unFollowUser(userId, followId);

  res.sendStatus(200).json({ message: "The user has been unfollowed" });
};

export const usersControllers = {
  getUserById: ctrlWrapper(getUserById),
  updateAvatar: ctrlWrapper(updateAvatar),
  getFollowers: ctrlWrapper(getFollowers),
  getFollowing: ctrlWrapper(getFollowing),
  followUser: ctrlWrapper(followUser),
  unFollowUser: ctrlWrapper(unFollowUser),
};
