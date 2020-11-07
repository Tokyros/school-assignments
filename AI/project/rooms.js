import { astar } from './astar.js';
import { dims } from './constants.js';


export const rooms = [
  { x1: 137, y1: 405, x2: 257, y2: 510 },
  { x1: 1, y1: 532, x2: 169, y2: 688 },
  { x1: 202, y1: 80, x2: 431, y2: 216 },
  { x1: 900, y1: 3, x2: 1085, y2: 216 },
  { x1: 896, y1: 440, x2: 1052, y2: 646 },
  { x1: 538, y1: 513, x2: 768, y2: 759 },
  { x1: 513, y1: 257, x2: 663, y2: 470 },
];

// export const rooms = generateRandomRooms(10, 10, 10, 10, 10);

function roomsIntersect(roomA, roomB) {
    // no horizontal overlap
	if (roomA.x1 >= roomB.x2 || roomB.x1 >= roomA.x2) return false;

	// no vertical overlap
	if (roomA.y1 >= roomB.y2 || roomB.y1 >= roomA.y2) return false;

	return true;
}

function contains(b) {
	return !(
		b.x1 < 0 ||
		b.y1 < 0 ||
		b.x2 > dims.canvasWidth ||
		b.y2 > dims.canvasHeight
	);
}

export function generateRandomRooms(roomCount, minDim, maxDim, canvasWidth, canvasHeight) {
  let rooms = [];
  for (let roomIdx = 0; roomIdx < roomCount; roomIdx++) {
    let roomIntersect = true;
    let roomCandidate;
    while (roomIntersect) {
      const x1 = Math.floor(Math.random() * canvasWidth);
      const y1 = Math.floor(Math.random() * canvasHeight);
      const x2 = x1 + (Math.floor(Math.random() * maxDim) + minDim);
      const y2 = y1 + (Math.floor(Math.random() * maxDim) + minDim);
      roomCandidate = {
        x1,
        y1,
        x2,
        y2,
      };

      roomIntersect = !contains(roomCandidate) || rooms.some((room) => roomsIntersect(roomCandidate, room));
    }

    rooms.push(roomCandidate);
  }
  return rooms;
}

export function intersects(room, point) {
  return (
    room.x1 <= point.x &&
    room.x2 >= point.x &&
    room.y1 <= point.y &&
    room.y2 >= point.y
  );
}

export function connectRooms(graph, rooms) {
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
        const middle = ({x1, x2, y1, y2}) => ({x: Math.floor((x1 + x2)/2), y: Math.floor((y1 + y2)/2)})
        const roomANode = graph.grid[middle(roomA).x][middle(roomA).y];
        const roomBNode = graph.grid[middle(roomB).x][middle(roomB).y];
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

  return connections.map((connection) => ({x: connection.x, y: connection.y}));
}
