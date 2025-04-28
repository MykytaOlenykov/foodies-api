import path from "node:path";

import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { HttpError } from "../helpers/HttpError.js";

const tmpDir = path.resolve("temp");

const mimetypeWhitelist = ["image/png", "image/jpeg", "image/jpg"];

const fileFilter = (_, file, cb) => {
  if (!mimetypeWhitelist.includes(file.mimetype)) {
    return cb(HttpError(400, "Only images (png, jpeg, jpg) are allowed"));
  }

  cb(null, true);
};

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: function (req, file, cb) {
    const userId = req?.user?.id;

    if (!userId) {
      return cb(new Error("Missing user ID"));
    }

    const ext = path.extname(file.originalname);

    cb(null, `${userId}_${uuidv4()}${ext}`);
  },
});

export const imageUpload = multer({
  storage: multerConfig,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});
