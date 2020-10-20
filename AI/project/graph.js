import { FLOOR, WALL } from './constants.js';
import { Graph } from './astar.js';
import { intersects } from './rooms.js';

export function generateGraph(width, height, rooms, connections) {
    return new Graph(
      new Array(width).fill(0).map((_, x) =>
        new Array(height).fill(0).map((_, y) => {
          if (
            rooms.some((room) => {
              return intersects(room, { x, y });
            }) ||
            connections.some(
              (connection) => connection.x === x && connection.y === y
            )
          ) {
            return FLOOR;
          } else {
            return WALL;
          }
        })
      )
    );
  }