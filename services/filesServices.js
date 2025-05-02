import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const fileCategories = {
  avatars: "avatars",
  recipes: "recipes",
};

const staticDir = path.join(process.cwd(), "public");

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

const processImage = async (file, category) => {
  const { filename, path: tmpUpload } = file;
  const fileFormat = path.extname(filename).toLowerCase().slice(1);

  const categoryDir = path.join(staticDir, category);
  await fs.mkdir(categoryDir, { recursive: true });
  const resultUpload = path.join(categoryDir, filename);

  await sharp(tmpUpload)
    .toFormat(fileFormat, { quality: 80 })
    .toFile(resultUpload);

  await removeFile(tmpUpload, true);
  const url = path.join(path.sep, category, filename);

  return url;
};

const processAvatar = async (file) => {
  return await processImage(file, fileCategories.avatars);
};

const processRecipeThumb = async (file) => {
  return await processImage(file, fileCategories.recipes);
};

export const filesServices = {
  removeFile,
  processAvatar,
  processRecipeThumb,
};
