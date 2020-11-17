import { dims, WALL } from "./constants.js";
import { rooms, intersects, objects } from "./rooms.js";
import { update } from "./state.js";
import { drawAmmo, initCanvas, drawRooms, drawFloor, drawPlayers, drawBullets, drawHealth, drawDebug, drawObjects } from './canvas.js';
import { generateGraph } from './graph.js';

const ctx = initCanvas("cvs", dims.canvasWidth, dims.canvasHeight);

const player1 = {
  team: 1,
  x: rooms[2].x1 + 0,
  y: rooms[2].y1 + 40,
  name: "Player 1",
  health: 100,
  // enemy: 2,
  enemy: 1,
  ammo: 9,
  entirePath: [],
  cooldown: 0,
};

const player2 = {
  team: 1,
  x: rooms[1].x1 + 60,
  y: rooms[1].y1 + 80,
  name: "Player 2",
  health: 100,
  enemy: 3,
  target: 3,
  ammo: 9,
  entirePath: [],
  cooldown: 0,
};

const player3 = {
  team: 2,
	x: rooms[3].x1 + 70,
  y: rooms[3].y1 + 70,
  health: 100,
  enemy: 0,
  name: "Player 3",
  ammo: 9,
  entirePath: [],
  cooldown: 0,
}

const player4 = {
  team: 2,
	x: rooms[6].x1 + 10,
  y: rooms[6].y1 + 10,
  health: 100,
  enemy: 1,
  name: "Player 4",
  ammo: 9,
  entirePath: [],
  cooldown: 0,
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

const graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections, objects);
console.timeEnd('generateGraph');

const randomPoint = () => {
  const randomRoomIdx = Math.floor(Math.random() * rooms.length);
  const room = rooms[randomRoomIdx];
  let randomX;
  let randomY;
  do {
    console.log('trying');
    randomX = Math.floor(Math.random() * (room.x2 - room.x1) + room.x1);
    randomY = Math.floor(Math.random() * (room.y2 - room.y1) + room.y1);
  } while (graph.grid[randomX][randomY].weight === WALL)
  
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
  players: [player1, player3],
  bullets: [],
  health: new Array(5).fill(0).map(() => ({
    ...randomPoint(),
    health: 20
  })),
  ammo: new Array(10).fill(0).map(() => ({
    ...randomPoint(),
    ammo: 5
  })),
  objects
};

// player1.target = {type: 'enemy', ...state.players[2]}
player1.target = {type: 'enemy', ...state.players[1]}
player3.target = {type: 'enemy', ...state.players[0]}
// player2.target = {type: 'enemy', ...state.players[3]}
// player4.target = {type: 'enemy', ...state.players[1]}

function main() {
	const timer = setInterval(() => {
    state = update(state);

    if (state.ammo.length < 10) {
      state.ammo.push(...new Array(10).fill(0).map(() => ({
        ...randomPoint(),
        ammo: 5
      })))
    }
    
    if ((state.players[0].dead) || (state.players[1].dead)) {
      clearInterval(timer);
      return;
    }
    
    requestAnimationFrame(() => {
      drawRooms(ctx, state.rooms);
      drawFloor(ctx, state.connections);
      drawObjects(ctx, state.objects);
      drawPlayers(ctx, state.players);
      drawBullets(ctx, state.bullets, state.players);
      drawHealth(ctx, state.health);
      drawAmmo(ctx, state.ammo);
      drawDebug(ctx, state);
    })
	}, 1000 / 120);
}

main();

