import { FLOOR } from "./constants.js";

export function computeDistance(pointA, pointB) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

export function findClosestPoint(points, point) {
  let distance = Infinity;
  let closestPoint;
  points.forEach((candidatePoint) => {
    const distanceToPoint = computeDistance(point, candidatePoint);
    if (distanceToPoint < distance) {
      distance = distanceToPoint;
      closestPoint = candidatePoint;
    }
  });

  return closestPoint;
}

export function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomPointInRoom(rectangle, grid) {
  while (true) {
    const point = {
      x: randomInRange(rectangle.x1, rectangle.x2),
      y: randomInRange(rectangle.y1, rectangle.y2)
    }

    if (grid[Math.floor(point.x)][Math.floor(point.y)].weight === FLOOR) return point;
  }
}

export function randomPointInRandomRoom (rooms, grid) {
  const randomRoomIdx = Math.floor(Math.random() * rooms.length);
  return randomPointInRoom(rooms[randomRoomIdx], grid);
}

export function isPointInRoom(room, point) {
  return (
    room.x1 <= point.x &&
    room.x2 >= point.x &&
    room.y1 <= point.y &&
    room.y2 >= point.y
  );
}

export function getCurrentRoom(point, rooms) {
  return rooms.find((room) =>
    isPointInRoom(room, {
      x: point.x + 5,
      y: point.y + 5,
    })
  );
}

export function inSameRoom(pointA, pointB, rooms) {
  const fromNodeRoom = rooms.findIndex((room) =>
  isPointInRoom(room, {
      x: pointA.x + 5,
      y: pointA.y + 5,
    })
  );
  const toNodeRoom = rooms.findIndex((room) =>
  isPointInRoom(room, {
      x: pointB.x + 5,
      y: pointB.y + 5,
    })
  );

  return toNodeRoom >= 0 && fromNodeRoom >= 0 && fromNodeRoom === toNodeRoom;
}
