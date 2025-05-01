import { listAreas } from "../services/areasServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllAreas = async (req, res) => {
  const { total, areas } = await listAreas(req.query);

  res.status(200).json({ data: { total, areas } });
};

export const areasControllers = {
  getAllAreas: ctrlWrapper(getAllAreas),
};
