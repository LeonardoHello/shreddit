import db from "@/lib/db";

export const getFiles = db.query.files.findMany({
  columns: { key: true },
});
