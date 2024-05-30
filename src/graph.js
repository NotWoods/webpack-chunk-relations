import * as d3 from "d3";
import { createSimulation, stopOnAbort } from "./simulation.js";

const statusText = document.querySelector("#status");
let requestedFrame = false;
function updateStatus(text) {
  if (requestedFrame) return;
  requestedFrame = true;
  requestAnimationFrame(() => {
    statusText.textContent = text;
    requestedFrame = false;
  });
}

/**
 *
 * @param {{ nodes, links }} data
 * @param {object} [options]
 * @param {AbortSignal} [options.invalidation]
 * @param {boolean} [options.interactive]
 * @returns
 */
function chart(data, options = {}) {
  // Specify the dimensions of the chart.
  const width = 928;
  const height = Math.floor(width * 0.9);

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create a simulation with several forces.
  const simulation = createSimulation(data);

  // Create the SVG container.
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.style = `width:${width}px;max-width: 100%; height: auto;`;

  function ticked(data) {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    for (const c of data.links) {
      context.moveTo(c.source.x, c.source.y);
      context.lineTo(c.target.x, c.target.y);
    }
    context.lineWidth = 0.5;
    context.stroke();

    context.beginPath();
    for (const c of data.nodes) {
      context.moveTo(c.x, c.y);
      context.arc(c.x, c.y, 2, 0, 2 * Math.PI);
    }
    context.fillStyle = "#000";
    context.fill();

    context.restore();
  }
  ticked(data);

  if (options.interactive) {
    simulation.restart();
    simulation.on("tick", () => {
      ticked(data);
    });
  }

  stopOnAbort(options.invalidation, simulation);

  return canvas;
}

const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
worker.onmessage = function (event) {
  switch (event.data.type) {
    case "chunk":
      updateStatus(`Processing chunk ${event.data.id}`);
      break;
    case "tick":
      updateStatus(`Tick progress: ${event.data.progress}%`);
      break;
    case "end":
      statusText.textContent = "Simulation complete.";
      document.body.appendChild(chart(event.data, { interactive: true }));
      break;
  }
};

/** @type {HTMLInputElement} */
const fileInput = document.querySelector("#file");
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  worker.postMessage(file);
});
