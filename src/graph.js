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
  const { nodes, links } = data;
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 680;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create a simulation with several forces.
  const simulation = createSimulation(data);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", (d) => color(d.group));

  node.append("title").text((d) => d.id);

  if (options.interactive) {
    simulation.restart();

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

  stopOnAbort(options.invalidation, simulation);

  return svg.node();
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
