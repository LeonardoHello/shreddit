export const uuidv4PathRegex =
  "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

export function encodeCursor(cursor: object) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

export function decodeCursor(str: string) {
  try {
    const jsonString = Buffer.from(str, "base64").toString("utf8");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid cursor provided:", error);
    return null;
  }
}
