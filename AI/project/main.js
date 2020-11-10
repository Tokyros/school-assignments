import { dims } from "./constants.js";
import { rooms, intersects, connectRooms } from "./rooms.js";
import { update } from "./state.js";
import { drawAmmo, initCanvas, drawRooms, drawFloor, drawPlayers, drawBullets, drawHealth, drawDebug } from './canvas.js';
import { generateGraph } from './graph.js';

const ctx = initCanvas("cvs", dims.canvasWidth, dims.canvasHeight);

const player1 = {
  team: 1,
  x: rooms[3].x1 + 10,
  y: rooms[3].y1 + 10,
  name: "Player 1",
  health: 100,
  enemy: 2,
  ammo: 9
};

const player2 = {
  team: 1,
  x: rooms[3].x1 + 50,
  y: rooms[3].y1 + 70,
  name: "Player 2",
  health: 100,
  enemy: 3,
  target: 3,
  ammo: 9
};

const player3 = {
  team: 2,
	x: rooms[4].x1 + 30,
  y: rooms[4].y1 + 50,
  // target: 0,
  health: 100,
  enemy: 0,
  name: "Player 3",
  ammo: 9
}

const player4 = {
  team: 2,
	x: rooms[4].x1 + 10,
  y: rooms[4].y1 + 10,
  // target: 0,
  health: 100,
  enemy: 1,
  name: "Player 4",
  ammo: 9
}

player1.target = player3;
player3.target = player1;
player2.target = player4;
player4.target = player2;

// const player4 = {
//   team: 2,
// 	x: rooms[3].x1 + 10,
//   y: rooms[3].y1 + 10,
//   target: 1,
//   health: 100,
//   name: "Player 4",
// }

const freeForAllGraph = new Graph(
  new Array(dims.canvasWidth).fill(0).map((_, x) =>
    new Array(dims.canvasHeight).fill(0).map((_, y) => {
        return rooms.some((room) => intersects(room, {x, y})) ? 1 : 99999999;
    })
  )
);

console.time('connectRooms');
const connections = window.connections; // connectRooms(freeForAllGraph, rooms);
console.timeEnd('connectRooms');

console.time('generateGraph');
const graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections);
console.timeEnd('generateGraph');

const randomPoint = () => {
  const randomRoomIdx = Math.floor(Math.random() * rooms.length);
  const room = rooms[randomRoomIdx];
  const randomX = Math.floor(Math.random() * (room.x2 - room.x1) + room.x1);
  const randomY = Math.floor(Math.random() * (room.y2 - room.y1) + room.y1);
  return {
    x: randomX,
    y: randomY
  }
}

let state = {
  graph,
  rooms,
  connections,
  // players: [player1, player2, player3, player4],
  // bullets: [{shotBy: 0, x: player1.x, y: player1.y, targetX: player3.x + 5, targetY: player3.y + 5}],
  players: [player1, player2, player3, player4],
  health: [{x: rooms[2].x1 + 50, y: rooms[2].y1 + 50, health: 50}, {x: rooms[1].x1 + 70, y: rooms[1].y1 + 70, health: 50}],
  ammo: new Array(10).fill(0).map(() => ({
    ...randomPoint(),
    ammo: 1
  })),
};

console.log(state);

player1.target = {type: 'enemy', ...state.players[2]}
player3.target = {type: 'enemy', ...state.players[0]}
player2.target = {type: 'enemy', ...state.players[3]}
player4.target = {type: 'enemy', ...state.players[1]}

function main() {
	setInterval(() => {
    state = update(state);
    if (state.ammo.length < 5) {
      state.ammo.push(...new Array(10).fill(0).map(() => ({
        ...randomPoint(),
        ammo: 1
      })))
    }

		drawRooms(ctx, state.rooms);
		drawFloor(ctx, state.connections);
    drawPlayers(ctx, state.players);
    drawBullets(ctx, state.players);
    drawHealth(ctx, state.health);
    drawAmmo(ctx, state.ammo);
    drawDebug(ctx, state);
	}, 1000 / 60);
}

main();

