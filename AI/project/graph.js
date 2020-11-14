import { FLOOR, WALL } from "./constants.js";
import { Graph } from "./astar.js";
import { intersects } from "./rooms.js";

export function generateGraph(width, height, rooms, connections, objs) {
  const twoDArr = new Array(width).fill(0).map(() => new Array(height).fill(0));
  connections.forEach((point) => {
    twoDArr[point.x][point.y] = FLOOR;
  });

  rooms.forEach((room, idx) => {
    for (let x = room.x1; x < room.x2; x++) {
      for (let y = room.y1; y < room.y2; y++) {
        if (objs.some((obj) => intersects(obj, {x, y}))) {
          twoDArr[x][y] = WALL;
        } else {
          twoDArr[x][y] = FLOOR;
        }
      }
    }    
  });

  return new Graph(twoDArr);
}
