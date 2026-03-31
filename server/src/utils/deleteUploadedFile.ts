import path from "path";
import fs from "fs";
import { fileDetails } from "./fileTypeUtils";

export const currentDir: string = __dirname;

export const deleteRequestFile = async (
  file: fileDetails | string,
  folder: string,
  uploadedFolder: string,
): Promise<void> => {
  if (!file) {
    return;
  }

  let fileName: string;

  if (typeof file === "object" && "filename" in file) {
    fileName = file.filename;
  } else if (typeof file === "string") {
    fileName = file;
  } else {
    throw new Error("Invalid file type!");
  }

  const filePath = path.resolve(
    currentDir,
    `../../${folder}/${uploadedFolder}/${fileName}`,
  );

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  return;
};
