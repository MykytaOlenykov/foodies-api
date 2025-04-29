import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { usersServices } from "../services/usersServices.js";

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await usersServices.getUserById(userId, req.user);

  res.status(200).json({
    data: { user },
  });
};

export const usersControllers = {
  getUserById: ctrlWrapper(getUserById),
};
