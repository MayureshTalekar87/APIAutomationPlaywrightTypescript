import fs from "fs";

export function readJson(filepath: string) {
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}
