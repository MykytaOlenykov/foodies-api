import { listAreas } from "../services/areasServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllAreas = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { total, areas } = await listAreas({}, { page, limit });

  res.status(200).json({ data: { total, areas } });
};

export const areasControllers = {
  getAllAreas: ctrlWrapper(getAllAreas),
};
