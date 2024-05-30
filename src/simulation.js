import * as d3 from "d3-force";
import { promises } from "stream";
import Chain from "stream-chain";
import Parser from "stream-json/Parser.js";
import Pick from "stream-json/filters/Pick.js";
import StreamArray from "stream-json/streamers/StreamArray.js";

/**
 * Build nodes for d3 graph from webpack stats
 * @param {import('../schema/stats').WebpackStats} stats
 * @param {(id: number) => void} progress
 */
export async function convertStatsToNodes(stats, progress = () => {}) {
  const nodes = [];
  const links = [];

  const pipeline = Chain.chain([
    stats,
    Parser.parser(),
    Pick.pick({ filter: /^chunks$/ }),
    StreamArray.make(),
  ]);
  pipeline.on("data", (data) => {
    const { value } = data;
    if (value) {
      progress(value.id);
      nodes.push({
        id: value.id,
        radius: value.size,
      });
      value.parents.forEach((parent) => {
        links.push({
          source: parent,
          target: value.id,
        });
      });
    }
  });
  await promises.finished(pipeline);

  return {
    nodes,
    links,
  };
}

/**
 * Create a simulation with several forces.
 */
export function createSimulation(data) {
  // Extract nodes and links from the data, which will be mutated.
  const { nodes, links } = data;

  // Create a simulation with several forces.
  return d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .stop();
}

/**
 * Stop the simulation when the signal is aborted.
 * @param {AbortSignal | undefined} signal
 * @param {d3.Simulation} simulation
 */
export function stopOnAbort(signal, simulation) {
  if (!signal) return;

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alphlina is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  if (signal.aborted) {
    simulation.stop();
  } else {
    signal.addEventListener("abort", () => simulation.stop());
  }
}
