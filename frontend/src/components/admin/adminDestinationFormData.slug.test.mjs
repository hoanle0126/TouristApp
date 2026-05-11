import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./adminDestinationFormData.ts", import.meta.url), "utf8");
const match = source.match(/export function slugifyDestinationTitle\(title: string\) \{([\s\S]*?)\n\}/);

if (!match) {
  throw new Error("slugifyDestinationTitle was not found.");
}

const slugifyDestinationTitle = new Function("title", `${match[1]}\n`) ;

test("slugifyDestinationTitle transliterates Vietnamese accents before removing invalid slug characters", () => {
  assert.equal(slugifyDestinationTitle("tết"), "tet");
  assert.equal(slugifyDestinationTitle("Đà Nẵng & Hội An"), "da-nang-and-hoi-an");
});
