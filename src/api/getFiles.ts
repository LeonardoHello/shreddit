import db from "@/db";

export const getFiles = db.query.files.findMany({
  columns: { key: true },
});
