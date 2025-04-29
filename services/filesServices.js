import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const fileCategories = {
  avatars: "avatars",
};

const staticDir = path.resolve("public");

const removeFile = async (filePath, isFullPath) => {
  try {
    const fullPath = isFullPath ? filePath : path.join(staticDir, filePath);
    await fs.access(fullPath);
    await fs.unlink(fullPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.log(`Error removing file: ${error.message}`);
    }
  }
};

const processAvatar = async (file) => {
  const { filename, path: tmpUpload } = file;
  const fileFormat = path.extname(filename).toLowerCase().slice(1);

  const avatarsDir = path.join(staticDir, fileCategories.avatars);
  const resultUpload = path.join(avatarsDir, filename);

  await sharp(tmpUpload)
    .toFormat(fileFormat, { quality: 80 })
    .toFile(resultUpload);

  await removeFile(tmpUpload, true);
  const avatarURL = path.join(path.sep, fileCategories.avatars, filename);

  return avatarURL;
};

export const filesServices = {
  removeFile,
  processAvatar,
};
