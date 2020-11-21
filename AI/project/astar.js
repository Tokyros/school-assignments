import { WALL } from "./constants.js";

// Manhattan distance
function heuristic(pos0, pos1) {
  const d1 = Math.abs(pos1.x - pos0.x);
  const d2 = Math.abs(pos1.y - pos0.y);
  return d1 + d2;
}

export const astar = function (graph, start, end) {
  graph.init();

  const openHeap = new BinaryHeap(function (node) {
    return node.f;
  });

  start.h = heuristic(start, end);
  graph.markDirty(start);

  openHeap.push(start);

  while (openHeap.size() > 0) {
    // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
    const currentNode = openHeap.pop();

    // End case -- result has been found, return the traced path.
    if (currentNode === end) {
      let curr = currentNode;
      const path = [];
      while (curr.parent) {
        path.unshift(curr);
        curr = curr.parent;
      }
      return path;
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors.
    currentNode.closed = true;

    // Find all neighbors for the current node.
    const neighbors = graph.neighbors(currentNode);

    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];

      if (neighbor.closed || neighbor.isWall()) {
        // Not a valid node to process, skip to next neighbor.
        continue;
      }

      // The g score is the shortest distance from start to current node.
      // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
      const gScore = currentNode.g + neighbor.weight;
      const beenVisited = neighbor.visited;

      if (!beenVisited || gScore < neighbor.g) {
        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        graph.markDirty(neighbor);

        if (!beenVisited) {
          // Pushing to heap will put it in proper place based on the 'f' value.
          openHeap.push(neighbor);
        } else {
          // Already seen the node, but since it has been rescored we need to reorder it in the heap
          openHeap.rescoreElement(neighbor);
        }
      }
    }
  }

  // No result was found - empty array signifies failure to find path.
  return [];
};

export class Graph {
  constructor(grid) {
    this.grid = grid.map((row, x) => {
      return row.map((node, y) => {
        return {
          x,
          y,
          weight: node,
          isWall: () => node === WALL,
        };
      });
    });
    this.init();
  }

  init() {
    if (this.dirtyNodes) {
      this.dirtyNodes.forEach(this.resetNode);
    }
    this.dirtyNodes = [];
  }

  markDirty(node) {
    this.dirtyNodes.push(node);
  }

  neighbors(node) {
    const neighbors = [];
    const x = node.x;
    const y = node.y;
    const grid = this.grid;

    if (grid[x - 1] && grid[x - 1][y]) {
      neighbors.push(grid[x - 1][y]);
    }

    if (grid[x + 1] && grid[x + 1][y]) {
      neighbors.push(grid[x + 1][y]);
    }

    if (grid[x] && grid[x][y - 1]) {
      neighbors.push(grid[x][y - 1]);
    }

    if (grid[x] && grid[x][y + 1]) {
      neighbors.push(grid[x][y + 1]);
    }

    return neighbors;
  }

  resetNode(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
    return node;
  }
}

// Binary heap implementation taken from the internet
// Used to speed up astar algorithm
function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function (element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function () {
    // Store the first element so we can return it later.
    const result = this.content[0];
    // Get the element at the end of the array.
    const end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function (node) {
    const i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    const end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function () {
    return this.content.length;
  },
  rescoreElement: function (node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function (n) {
    // Fetch the element that has to be sunk.
    const element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function (n) {
    // Look up the target element and its score.
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      let swap = null;
      let child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        const child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  },
};
