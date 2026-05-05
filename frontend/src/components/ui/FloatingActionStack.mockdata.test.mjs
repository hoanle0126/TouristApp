import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const componentPath = path.join(currentDir, "FloatingActionStack.tsx");
const source = await readFile(componentPath, "utf8");

assert.equal(
  source.includes("Bay Mau Coconut Forest còn chỗ không?"),
  false,
  "Quick prompt mock data should not exist in the initial chat panel.",
);

assert.equal(
  source.includes("Shining Riverside Hoi An còn phòng không?"),
  false,
  "Quick prompt mock data should not exist in the initial chat panel.",
);

assert.equal(
  source.includes("What hotels are available in Hoi An?"),
  false,
  "Quick prompt mock data should not exist in the initial chat panel.",
);

assert.equal(
  source.includes("Ask me about tours, hotels, current availability, or other information already published on this website."),
  false,
  "Initial assistant mock message should not exist in the initial chat panel.",
);

console.log("FloatingActionStack mockdata regression test passed.");
