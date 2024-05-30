import * as d3 from "d3-force";

/**
 *
 * @param {import('../schema/stats').WebpackStats} stats
 */
function findNodeRelations(stats) {
  return nodes.filter((n) => {
    return n.id !== node.id && n.relations.includes(node.id);
  });
}

function simulate(data) {
  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .stop();

  simulation.tick(300);

  return { nodes, links };
}
