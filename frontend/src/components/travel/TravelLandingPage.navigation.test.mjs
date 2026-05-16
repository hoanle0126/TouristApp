import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

const travelShellSource = readFileSync(
  path.join(projectRoot, "src/components/travel/TravelShell.tsx"),
  "utf8",
);
const mockDataSource = readFileSync(
  path.join(projectRoot, "src/data/mockData.ts"),
  "utf8",
);

const expectedLabels = [
  "Home",
  "Destinations",
  "Tours",
  "Hotels",
  "Blog",
  "About Us",
  "Contact",
];

assert.match(mockDataSource, /export const navigationItems = \[/);
for (const label of expectedLabels) {
  assert.match(mockDataSource, new RegExp(`"${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
}
assert.match(travelShellSource, /navigationItems\.map\(/);
assert.match(travelShellSource, /getDestinations\(\{ perPage: 3 \}\)/);
assert.match(travelShellSource, /getTours\(\{ perPage: 3 \}\)/);
assert.match(travelShellSource, /getHotels\(\{ perPage: 3 \}\)/);
assert.match(travelShellSource, /slice\(0, 3\)/);

console.log("Travel landing navigation smoke test passed");
