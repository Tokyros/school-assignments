import { FLOOR } from "./constants.js";
import { Graph } from "./astar.js";

export function generateGraph(width, height, rooms, connections) {
  const twoDArr = new Array(width).fill(0).map(() => new Array(height).fill(0));
  connections.forEach((point) => {
    twoDArr[point.x][point.y] = FLOOR;
  });

  rooms.forEach((room) => {
    for (let x = room.x1; x < room.x2; x++) {
      for (let y = room.y1; y < room.y2; y++) {
        twoDArr[x][y] = FLOOR;
      }
    }    
  });

  return new Graph(twoDArr);
}
