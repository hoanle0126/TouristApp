import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

function readTravelComponent(fileName) {
  return readFileSync(path.join(projectRoot, "src/components/travel", fileName), "utf8");
}

const destinationsSource = readTravelComponent("DestinationsListingPage.tsx");
const hotelsSource = readTravelComponent("HotelsListingPage.tsx");
const toursSource = readTravelComponent("ToursListingPage.tsx");

for (const source of [destinationsSource, hotelsSource, toursSource]) {
  assert.match(source, /lg:flex-row/);
  assert.match(source, /lg:w-72/);
  assert.match(source, /Showing \{/);
  assert.match(source, /View:/);
  assert.match(source, /Latest collection/);
}

console.log("Listing pages layout smoke test passed");
