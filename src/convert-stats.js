/**
 *
 * @param {import('../schema/stats').WebpackStats} stats
 */
function findNodeRelations(stats) {
  const nodes = stats.chunks.map((chunk) => {
    return {
      id: chunk.id,
      radius: chunk.size,
    };
  });
}
