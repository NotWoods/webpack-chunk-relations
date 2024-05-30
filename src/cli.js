import { createSimulation, convertStatsToNodes } from "./simulation.js";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { resolve } from "node:path";

const { values } = parseArgs({
  options: {
    stats: { type: "string" },
    simulate: { type: "boolean", default: false },
  },
});

const stats = createReadStream(resolve(process.cwd(), values.stats));
const data = await convertStatsToNodes(stats);

if (values.simulate) {
  console.log("Simulating...");
  createSimulation(stats).tick(300);
}

await writeFile(
  resolve(process.cwd(), "nodes.json"),
  JSON.stringify(data, null, 2)
);
