import { dims } from "./constants.js";

export function initCanvas(id, width, height) {
  const cvs = document.getElementById(id);
  cvs.width = width;
  cvs.height = height;
  return cvs.getContext("2d");
}

export function drawRooms(ctx, rooms) {
  rooms.forEach((room) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(
      room.x1,
      room.y1,
      room.x2 - room.x1 + dims.POINT_SIZE,
      room.y2 - room.y1 + dims.POINT_SIZE
    );
  });
}

export function drawFloor(ctx, nodes) {
  nodes.forEach((node) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(node.x, node.y, dims.POINT_SIZE, dims.POINT_SIZE);
  });
}

export function drawPlayers(ctx, players) {
  players.map((node) => {
    ctx.fillStyle = "red";
    ctx.fillRect(node.x, node.y, dims.POINT_SIZE, dims.POINT_SIZE);
  });
}
