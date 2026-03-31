import { CustomError } from "@utils/customError";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const checkExtension = (file: Express.Multer.File, allowedExts: string[]) => {
  const ext = path.extname(file.originalname).toLowerCase();
  return allowedExts.includes(ext);
};

export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMime = file.mimetype.startsWith("image/");
  const allowedExt = checkExtension(file, [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".webp",
  ]);

  if (allowedMime && allowedExt) {
    cb(null, true);
  } else {
    cb(
      new CustomError(
        "Only image files are accepted! (jpg, png, gif, svg, webp)",
        400,
      ),
    );
  }
};

export const getMulterDiskStorageOptions = (
  destinationFolder: string,
  subFolder: string,
) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const productImagesDirectory = path.resolve(
        __dirname,
        `../../${destinationFolder}/${subFolder}`,
      );

      if (!fs.existsSync(productImagesDirectory)) {
        fs.mkdirSync(productImagesDirectory, { recursive: true });
      }
      return cb(null, productImagesDirectory);
    },
    filename: function (req, file, cb) {
      const uniqueId = uuidv4().replace(/-/, "");
      const fName = `${uniqueId}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fName);
    },
  });
};
