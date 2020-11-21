import { FLOOR, WALL } from "./constants.js";
import { Graph } from "./astar.js";
import { intersects } from "./rooms.js";

export function generateGraph(width, height, rooms, connections, objs) {
  const twoDArr = new Array(width).fill(WALL).map(() => new Array(height).fill(WALL));
  connections.forEach((point) => {
    twoDArr[point.x][point.y] = FLOOR;
  });

  rooms.forEach((room, idx) => {
    for (let x = room.x1; x < room.x2; x++) {
      for (let y = room.y1; y < room.y2; y++) {
        twoDArr[x][y] = FLOOR;
      }
    }    
  });

  objs.forEach((obj) => {
    for (let x = obj.x1; x <= obj.x2; x++) {
      for (let y = obj.y1; y <= obj.y2; y++) {
        twoDArr[Math.floor(x)][Math.floor(y)] = WALL;
      }      
    }
  })

  return new Graph(twoDArr);
}
