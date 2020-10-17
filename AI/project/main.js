import { dims } from "./constants.js";
import { update } from "./state.js";

// characteristics
// 1. Brave 1-10 (how fast he runs away)

// === INIT ===
// 1. Setup canvas
// 2. Generate random rooms
// 3. Create paths between all rooms
// 4. Create characters (random characteristics)
// 5. Create items
// 6. Create security map

// === Main Loop ===
// 1.

const SIZE = 15;

let ctx;

const WALL = 1;
const FLOOR = 0;

const rooms = [
  { x1: 137, y1: 405, x2: 257, y2: 510 },
  { x1: 1, y1: 532, x2: 169, y2: 688 }, // 1
  { x1: 202, y1: 80, x2: 431, y2: 216 },
  { x1: 900, y1: 3, x2: 1085, y2: 216 }, // 3
  { x1: 896, y1: 440, x2: 1052, y2: 646 },
  { x1: 538, y1: 513, x2: 768, y2: 759 },
  { x1: 513, y1: 257, x2: 663, y2: 470 },
];

function generateRandomRooms(roomCount, minDim, maxDim) {
  let rooms = [];
  for (let roomIdx = 0; roomIdx < roomCount; roomIdx++) {
    let roomIntersect = true;
    let roomCandidate;
    while (roomIntersect) {
      const x1 = Math.floor(Math.random() * dims.canvasWidth);
      const y1 = Math.floor(Math.random() * dims.canvasHeight);
      const x2 = x1 + (Math.floor(Math.random() * maxDim) + minDim);
      const y2 = y1 + (Math.floor(Math.random() * maxDim) + minDim);
      roomCandidate = {
        x1,
        y1,
        x2,
        y2,
      };

      roomIntersect =
        !contains(canvas, roomCandidate) ||
        rooms.some((room) => roomsIntersect(roomCandidate, room));
    }

    rooms.push(roomCandidate);
  }
  return rooms;
}

function intersects(room, point) {
  return (
    room.x1 <= point.x &&
    room.x2 >= point.x &&
    room.y1 <= point.y &&
    room.y2 >= point.y
  );
}

function initCanvas() {
  const cvs = document.getElementById("cvs");
  ctx = cvs.getContext("2d");
  cvs.width = dims.canvasWidth;
  cvs.height = dims.canvasHeight;
}

function draw(maze) {
  ctx.clearRect(0, 0, dims.canvasWidth, dims.canvasHeight);
  maze.forEach((col, x) => {
    col.forEach((node, y) => {
      switch (node.weight) {
        case FLOOR:
          ctx.fillStyle = "gray";
          break;
        case WALL:
          ctx.fillStyle = "white";
          return;
      }

      ctx.fillRect(node.x, node.y, SIZE, SIZE);
    });
  });
}

function drawRooms(rooms) {
  rooms.forEach((room) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(room.x1, room.y1, room.x2 - room.x1, room.y2 - room.y1);
  });
}

function connectRooms(graph, rooms) {
  let connections = [];
  let connected = {};

  rooms.forEach((roomA) => {
    connected[`${roomA.x1}-${roomA.y1}`] = [];
  });

  rooms.forEach((roomA) => {
    rooms.forEach((roomB) => {
      const roomAKey = `${roomA.x1}-${roomA.y1}`;
      const roomBKey = `${roomB.x1}-${roomB.y1}`;
      const alreadyConnected =
        connected[roomAKey].includes(roomBKey) ||
        connected[roomBKey].includes(roomAKey) ||
        roomAKey === roomBKey;

      if (!alreadyConnected) {
        const roomANode = graph.grid[roomA.x1][roomA.y1];
        const roomBNode = graph.grid[roomB.x1][roomB.y1];
        const path = astar.search(graph, roomANode, roomBNode);

        const existingConnections = [
          ...connected[roomAKey],
          ...connected[roomBKey],
        ];

        connected[roomAKey] = [...existingConnections, roomBKey];

        connected[roomBKey] = [...existingConnections, roomAKey];

        connections = [...connections, ...path];
      }
    });
  });

  return connections;
}

function drawFloor(nodes) {
  nodes.forEach((node) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(node.x, node.y, SIZE, SIZE);
  });
}

const player1 = {
  x: rooms[0].x1 + 10,
  y: rooms[0].y1 + 10,
  target: {
    x: rooms[5].x1 + 20,
    y: rooms[5].y1 + 20,
  },
};

const player2 = {
  x: rooms[3].x1 + 10,
  y: rooms[3].y1 + 10,
  target: player1,
};

let graph = new Graph(
  new Array(dims.canvasWidth).fill(0).map((_, x) =>
    new Array(dims.canvasHeight).fill(0).map((_, y) => {
        return rooms.some((room) => intersects(room, {x, y})) ? 1 : 99999999;
    })
  )
);
const connections = connectRooms(graph, rooms);
graph = generateGraph(dims.canvasWidth, dims.canvasHeight, rooms, connections);

function generateGraph(width, height, rooms, connections) {
  return new Graph(
    new Array(width).fill(0).map((_, x) =>
      new Array(height).fill(0).map((_, y) => {
        if (
          rooms.some((room) => {
            return intersects(room, { x, y });
          }) ||
          connections.some(
            (connection) => connection.x === x && connections.y === y
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

let state = {
  graph,
  rooms,
  connections,
  players: [player1, player2],
  health: [],
  ammo: [],
};

initCanvas();
draw(state.graph.grid);

function drawPlayers(players) {
  players.map((node) => {
    ctx.fillStyle = "red";
    ctx.fillRect(node.x, node.y, SIZE, SIZE);
  });
}

setInterval(() => {
  const oldState = { ...state };
  state = update(oldState);

  drawFloor(state.connections);
  drawRooms(state.rooms);
  drawPlayers(state.players);
}, 1000 / 120);
