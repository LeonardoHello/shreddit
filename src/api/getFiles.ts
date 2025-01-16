import db from "@/db";

export const getFiles = db.query.postFiles.findMany({
  columns: { key: true },
});
