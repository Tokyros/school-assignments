import { dims } from "./constants.js";
import { rooms, intersects, connectRooms } from "./rooms.js";
import { update } from "./state.js";
import { initCanvas, drawRooms, drawFloor, drawPlayers } from './canvas.js';
import { generateGraph } from './graph.js';

const ctx = initCanvas("cvs", dims.canvasWidth, dims.canvasHeight);

const player1 = {
  x: rooms[0].x1 + 10,
  y: rooms[0].y1 + 10,
  // target: player4,
};

const player2 = {
  x: rooms[1].x1 + 10,
  y: rooms[1].y1 + 10,
  target: player1,
};

player1.target = player2;

// const player3 = {
// 	x: rooms[2].x1 + 10,
//   y: rooms[2].y1 + 10,
//   target: player2,
// }

// const player4 = {
// 	x: rooms[1].x1 + 10,
//   y: rooms[1].y1 + 10,
//   target: player3,
// }

// player1.target = player4;

const freeForAllGraph = new Graph(
  new Array(dims.canvasWidth).fill(0).map((_, x) =>
    new Array(dims.canvasHeight).fill(0).map((_, y) => {
        return rooms.some((room) => intersects(room, {x, y})) ? 1 : 99999999;
    })
  )
);

const connections = connectRooms(freeForAllGraph, rooms);

const graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections);

let state = {
  graph,
  rooms,
  connections,
  players: [player1, player2], //, player3, player4],
  health: [],
  ammo: [],
};

function main() {
	setInterval(() => {
		state = update(state);
	
		drawRooms(ctx, state.rooms);
		drawFloor(ctx, state.connections);
		drawPlayers(ctx, state.players);
	}, 1000 / 120);
}

main();

