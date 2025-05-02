import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { usersServices } from "../services/usersServices.js";

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await usersServices.getUserById(userId, req.user);

  res.status(200).json({
    data: { user },
  });
};

const updateAvatar = async (req, res) => {
  const { id: userId } = req.user;

  const { avatarURL } = await usersServices.updateUserAvatar(userId, req.file);

  res.status(200).json({ data: { avatarURL } });
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;

  const { followers, total } = await usersServices.getFollowers(
    userId,
    req.query
  );

  res.status(200).json({ data: { followers, total } });
};

const getFollowing = async (req, res) => {
  const { id: userId } = req.user;

  const { following, total } = await usersServices.getFollowing(
    userId,
    req.query
  );

  res.status(200).json({ data: { following, total } });
};

const followUser = async (req, res) => {
  const { userId: followId } = req.params;
  const { id: userId } = req.user;

  await usersServices.followUser(userId, followId);

  res.status(200).json({ data: { message: "The user has been followed" } });
};

const unFollowUser = async (req, res) => {
  const { userId: followId } = req.params;
  const { id: userId } = req.user;

  await usersServices.unFollowUser(userId, followId);

  res.status(200).json({ data: { message: "The user has been unfollowed" } });
};

export const usersControllers = {
  getUserById: ctrlWrapper(getUserById),
  updateAvatar: ctrlWrapper(updateAvatar),
  getFollowers: ctrlWrapper(getFollowers),
  getFollowing: ctrlWrapper(getFollowing),
  followUser: ctrlWrapper(followUser),
  unFollowUser: ctrlWrapper(unFollowUser),
};
