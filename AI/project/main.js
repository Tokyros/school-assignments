import { dims } from "./constants.js";
import { rooms, intersects, connectRooms } from "./rooms.js";
import { update } from "./state.js";
import { drawAmmo, initCanvas, drawRooms, drawFloor, drawPlayers, drawBullets, drawHealth, drawDebug, drawObjects } from './canvas.js';
import { generateGraph } from './graph.js';

const ctx = initCanvas("cvs", dims.canvasWidth, dims.canvasHeight);

const player1 = {
  team: 1,
  x: rooms[1].x1 + 20,
  y: rooms[1].y1 + 40,
  name: "Player 1",
  health: 100,
  enemy: 2,
  ammo: 9,
  entirePath: [],
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
};

const player3 = {
  team: 2,
	x: rooms[5].x1 + 70,
  y: rooms[5].y1 + 70,
  health: 100,
  enemy: 0,
  name: "Player 3",
  ammo: 9,
  entirePath: [],
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

function randomInRange(from, to) {
  return Math.floor((Math.random() * (to - from)) + from);
}

function randomInRoom(room) {
  return {
    x: randomInRange(room.x1, room.x2),
    y: randomInRange(room.y1, room.y2)
  }
}

console.time('generateGraph');
const objects = rooms.reduce((objs, room) => {
  const objWidth = 20;
  const objHeight = 50;
  const randomPoint1 = randomInRoom(room);
  const randomPoint2 = randomInRoom(room);
  
  const obj1 = {
    x1: randomPoint1.x , 
    x2: randomPoint1.x + objWidth,
    y1: randomPoint1.y, 
    y2: randomPoint1.y + objHeight,
  }
  
  const obj2 = {
    x1: randomPoint2.x, 
    x2: randomPoint2.x + objWidth,
    y1: randomPoint2.y, 
    y2: randomPoint2.y + objHeight,
  }

  return [...objs, obj1, obj2]
}, []);
const graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections, objects);
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
  players: [player1, player2, player3, player4],
  health: new Array(0).fill(0).map(() => ({
    ...randomPoint(),
    health: 20
  })),
  ammo: new Array(10).fill(0).map(() => ({
    ...randomPoint(),
    ammo: 5
  })),
  objects
};

player1.target = {type: 'enemy', ...state.players[2]}
player3.target = {type: 'enemy', ...state.players[0]}
player2.target = {type: 'enemy', ...state.players[3]}
player4.target = {type: 'enemy', ...state.players[1]}

function main() {
	setInterval(() => {
    state = update(state);
    if (state.ammo.length < 10) {
      state.ammo.push(...new Array(10).fill(0).map(() => ({
        ...randomPoint(),
        ammo: 5
      })))
    }

    if ((player1.dead && player2.dead) || (player3.dead && player4.dead)) {
      return;
    }

    drawRooms(ctx, state.rooms);
		drawFloor(ctx, state.connections);
    drawObjects(ctx, state.objects);
    drawPlayers(ctx, state.players);
    drawBullets(ctx, state.players);
    drawHealth(ctx, state.health);
    drawAmmo(ctx, state.ammo);
    drawDebug(ctx, state);
	}, 1000 / 120);
}

main();

