import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// List of world names from the provided CSV
const worlds = [
  "cyberpunk",
  "1920",
  "street_market",
  "medieval",
  "fantasy",
  "western",
  "beach_party",
  "post_apocalypse",
  "farm",
  "noir_detective",
  "fashion_week",
  "camp_site",
  "jungle_ruins",
  "polar_station",
  "1950_gas_station",
  "steampunk",
];

const generated = [];
for (let i = 1; i <= 5000; i++) {
  const user_id = `user${100 + (i % 100)}`;
  const world = worlds[i % worlds.length];
  const stars = 1 + (i % 3); // 1, 2, or 3
  const correct = 5 + (i % 8); // 5..12
  const remaining = 15 - correct;
  const incorrect = Math.min(remaining, i % 5); // 0..4
  const skipped = Math.min(remaining - incorrect, i % 4); // 0..3
  const missed = 15 - correct - incorrect - skipped;

  const neurons = 30 + (i % 50);
  const day = (11 + (i % 20)).toString().padStart(2, "0");
  const hour = (8 + (i % 12)).toString().padStart(2, "0");
  const timestamp = `2025-04-${day}T${hour}:00:00.000Z`;
  generated.push({
    $id: i.toString(),
    user_id,
    world,
    neurons,
    timestamp,
    stars,
    correct,
    incorrect,
    skipped,
    missed,
  });
}

const allData = {
  gameData: [...generated],
};

const outPath = join(__dirname, "src", "data", "sampleGameData.json");
writeFileSync(outPath, JSON.stringify(allData, null, 2));
console.log("sampleGameData.json generated with 2000 entries at", outPath);
