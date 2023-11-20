import db from "../db";
import { File, files } from "../db/schema";

export const setFile = (fileData: Omit<File, "id">) => {
  return db.insert(files).values(fileData);
};
