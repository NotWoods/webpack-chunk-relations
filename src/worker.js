import { get, set } from "idb-keyval";
import { Readable, addAbortSignal } from "stream";
import { createSimulation, convertStatsToNodes } from "./simulation.js";

function simulationLength(simulation) {
  return Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
  );
}

/**
 * @param {Blob} blob
 */
async function getHash(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

/** @type {AbortController | undefined} */
let abortController;
self.onmessage = async function startSimulation(event) {
  abortController?.abort();
  abortController = new AbortController();

  /** @type {File} */
  const file = event.data;
  const [cachedValue, hash] = await Promise.all([get("last"), getHash(file)]);
  console.log(hash);

  let data;
  let cacheJob;
  if (cachedValue && cachedValue.hash === hash) {
    data = cachedValue.data;
    console.log("Using cached data");
  } else {
    const stats = addAbortSignal(
      abortController.signal,
      Readable.from(file.stream())
    );
    const data = await convertStatsToNodes(stats, (id) => {
      postMessage({ type: "chunk", id });
    });

    cacheJob = set("last", { data, hash });
    cacheJob.then(() => {
      console.log("Cached data");
    });
  }

  console.log("Simulating...");
  const simulation = createSimulation(data);

  for (let i = 0; i < 150; ++i) {
    postMessage({ type: "tick", progress: i });
    simulation.tick(10);
    if (abortController.signal.aborted) {
      return;
    }
  }
  await cacheJob;
  postMessage({ type: "end", nodes: data.nodes, links: data.links });
};
