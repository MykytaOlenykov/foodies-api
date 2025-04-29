import { listAreas, countAreas } from "../services/areasServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllAreas = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await countAreas();
  const result = await listAreas({}, { page, limit });

  res.json({ total, result });
};

export const areasControllers = {
  getAllAreas: ctrlWrapper(getAllAreas),
};