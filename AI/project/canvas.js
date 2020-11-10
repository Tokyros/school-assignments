import { dims } from "./constants.js";
import { intersects } from "./rooms.js";

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
  players.map((player, idx) => {
    ctx.fillStyle = player.team === 1 ? "red" : "blue";
    if (player.dead) {
      ctx.fillStyle = 'black';
    }
    ctx.fillRect(player.x, player.y, dims.POINT_SIZE, dims.POINT_SIZE);
    ctx.fillStyle = "white";
    ctx.fillText(`${idx + 1}`, player.x + 5, player.y + 10);
    ctx.fillText(`${player.health}`, player.x + 5, player.y + 15);
  });
}

export function drawBullets(ctx, players) {
  players.forEach((player) => {
    const bullet = player.bullet;
    if (bullet) {
      ctx.fillStyle = player.team === 1 ? "red" : "blue";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

export function drawHealth(ctx, healths) {
  healths.forEach((health) => {
    ctx.fillStyle = "green";
    ctx.fillRect(health.x, health.y, dims.POINT_SIZE, dims.POINT_SIZE);
  })
}

export function drawAmmo(ctx, ammos) {
  ammos.forEach((ammo) => {
    ctx.fillStyle = "brown";
    ctx.fillRect(ammo.x, ammo.y, dims.POINT_SIZE, dims.POINT_SIZE);
  })
}

export function drawDebug(ctx, state) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 300, 70);
  state.players.forEach((player, idx) => {
    const room = state.rooms.findIndex((room) => intersects(room, player));
    
    ctx.fillStyle = 'black';
    ctx.fillText(`${player.name}: ammo:${player.ammo}, ${player.target.type}, target: {x: ${player.target.x}, y: ${player.target.y}}`, 10, (idx + 1) * 15, 2000);
  })

  state.rooms.forEach((room) => {
    ctx.fillStyle = 'black';
    ctx.fillText(`x1: ${room.x1}, y1: ${room.y1}`, room.x1, room.y1, 2000);
  })

  ctx.fillText(`230,246`, 230, 246);
}