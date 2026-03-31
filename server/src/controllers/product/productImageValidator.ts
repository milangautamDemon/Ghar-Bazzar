import {
  getMulterDiskStorageOptions,
  imageFilter,
} from "@utils/fileValidators";
import multer from "multer";

const multerDiskStorageOptions = getMulterDiskStorageOptions(
  "uploads",
  "product",
);

export const productImageValidation = multer({
  storage: multerDiskStorageOptions,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    imageFilter(req, file, cb);
  },
}).single("productImage");
