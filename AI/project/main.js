import { dims, WALL } from "./constants.js";
import { rooms, objects } from "./rooms.js";
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
  enemy: 2,
  ammo: 9,
  character: {
    minHealth: 50,
    minAmmo: 3,
  },
  entirePath: [],
  path: [],
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
  character: {
    minHealth: 20,
    minAmmo: 5,
  },
  entirePath: [],
  path: [],
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
  character: {
    minHealth: 70,
    minAmmo: 1,
  },
  entirePath: [],
  path: [],
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
  character: {
    minHealth: 10,
    minAmmo: 1,
  },
  entirePath: [],
  path: [],
  cooldown: 0,
}

player1.target = player3;
player3.target = player1;
player2.target = player4;
player4.target = player2;

// const freeForAllGraph = new Graph(
//   new Array(dims.canvasWidth).fill(0).map((_, x) =>
//     new Array(dims.canvasHeight).fill(0).map((_, y) => {
//         return rooms.some((room) => intersects(room, {x, y})) ? 1 : 99999999;
//     })
//   )
// );

console.time('connectRooms');
const connections = window.connections; // connectRooms(freeForAllGraph, rooms);
console.timeEnd('connectRooms');

console.time('generateGraph');

const graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections, objects);
console.timeEnd('generateGraph');

const randomPointInRoom = (roomIdx) => {
  const room = rooms[roomIdx];
  let randomX;
  let randomY;
  do {
    randomX = Math.floor(Math.random() * (room.x2 - room.x1) + room.x1);
    randomY = Math.floor(Math.random() * (room.y2 - room.y1) + room.y1);
  } while (graph.grid[randomX][randomY].weight === WALL)
  
  return {
    x: randomX,
    y: randomY
  }
}

const randomPoint = () => {
  const randomRoomIdx = Math.floor(Math.random() * rooms.length);
  return randomPointInRoom(randomRoomIdx);
}

const ammo = new Array(rooms.length * 2).fill(0).map((_, idx) => ({
  ...randomPointInRoom(Math.floor(idx / 2)),
  ammo: 5
}));

const health = new Array(rooms.length * 2).fill(0).map((_, idx) => ({
  ...randomPointInRoom(Math.floor(idx / 2)),
  health: 20
}));

let state = {
  graph,
  rooms,
  connections,
  players: [player1, player2, player3, player4],
  bullets: [],
  health,
  ammo,
  objects
};

player1.target = {type: 'enemy', ...state.players[2]}
player2.target = {type: 'enemy', ...state.players[3]}
player3.target = {type: 'enemy', ...state.players[0]}
player4.target = {type: 'enemy', ...state.players[1]}


function createBullet (from, to, playerIdx) {
  const targetY = to.y + 5;
  const targetX = to.x + 5;
  const bulletX = from.x + 5;
  const bulletY = from.y + 5;

  const dx = targetX - bulletX;
  const dy = targetY - bulletY;
  const angle = Math.atan2(dy, dx);

  const directionX = Math.cos(angle);
  const directionY =  Math.sin(angle);

  return {
    from: playerIdx,
    type: 'bullet',
    x: bulletX,
    y: bulletY,
    damage: 10,
    direction: {
      x: directionX,
      y: directionY
    }
  }
}

function createSecurityMap() {
  const bulletsToCover = rooms.reduce((bullets, room) => {
    const grenades = [
      {x: Math.floor((room.x1 + room.x2) / 2), y: Math.floor((room.y1 + room.y2) / 2)},
      {x: room.x1 + 10, y: room.y1 + 10},
      {x: room.x1 + 10, y: room.y2 - 10},
      {x: room.x2 - 10, y: room.y1 + 10},
      {x: room.x2 - 10, y: room.y2 - 10},
    ]

    const newBullets = grenades.reduce((bulletsFromGrenades, grenade) => {
      let bulletsFromSingleGrenade = [];
      for (let angle = 0; angle < 360; angle += 1) {
        const theta = angle * (Math.PI / 180)
        const dx = Math.cos(theta) * 500;
        const dy = Math.sin(theta) * 500;
        const target = {x: grenade.x + dx, y: grenade.y + dy};
        bulletsFromSingleGrenade.push(createBullet(grenade, target, 0));
      }
      return [...bulletsFromGrenades, ...bulletsFromSingleGrenade]
    }, []);
    
    return [
      ...bullets,
      ...newBullets
    ]
  }, []);

  let securitySimulationState = {
    graph,
    rooms,
    connections,
    objects,
    bullets: bulletsToCover,
    players: [],
    health: [],
    ammo: [],
  }

  const securityMap = new Array(dims.canvasWidth).fill(0).map((_) =>
    new Array(dims.canvasHeight).fill(0).map((_) => {
        return 0;
    })
  );

  do {
    securitySimulationState = update(securitySimulationState);
    securitySimulationState.bullets.forEach((bullet) => {
      securityMap[Math.floor(bullet.x)][Math.floor(bullet.y)] += 1;
    })
  } while (securitySimulationState.bullets.length)
  return securityMap;
}

state.securityMap = createSecurityMap();

function main() {
	const timer = setInterval(() => {
    state = update(state);

    if (state.ammo.length < 10) {
      state.ammo.push(...new Array(10).fill(0).map(() => ({
        ...randomPoint(),
        ammo: 5
      })))
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
    });

    if ((state.players[0].dead && state.players[1].dead) || (state.players[2].dead && state.players[3].dead)) {
      clearInterval(timer);
      return;
    }
	}, 1000 / 120);
}

main();

