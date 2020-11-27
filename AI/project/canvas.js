import { dimensions } from "./constants.js";
import { isPointInRoom } from "./geometry.js";

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
      room.x2 - room.x1 + dimensions.POINT_SIZE,
      room.y2 - room.y1 + dimensions.POINT_SIZE
    );
  });
}

export function drawObjects(ctx, objs) {
  objs.forEach((obj) => {
    ctx.fillStyle = "orange";
    ctx.fillRect(
      obj.x1,
      obj.y1,
      obj.x2 - obj.x1,
      obj.y2 - obj.y1
    );
  });
}

export function drawFloor(ctx, nodes) {
  nodes.forEach((node) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(node.x, node.y, dimensions.POINT_SIZE, dimensions.POINT_SIZE);
  });
}

export function drawPlayers(ctx, players) {
  players.map((player, idx) => {
    ctx.fillStyle = player.team === 1 ? "red" : "blue";
    if (player.dead) {
      ctx.fillStyle = 'black';
    } else {
      switch (player.target.type) {
        case 'ammo':
          ctx.fillStyle = 'brown';
          break;
        case 'health':
          ctx.fillStyle = 'green';
          break;
      }
    }
    ctx.fillRect(player.x, player.y, dimensions.POINT_SIZE, dimensions.POINT_SIZE);
    ctx.fillStyle = "white";
    ctx.fillText(`${idx + 1}`, player.x + 5, player.y + 10);
    ctx.fillText(`${player.health}`, player.x + 5, player.y + 20);
  });
}

export function drawBullets(ctx, bullets, players) {
  bullets.forEach((bullet) => {
    const player = players.find((_, idx) => idx === bullet.from);
    ctx.fillStyle = player.team === 1 ? "red" : "blue";
    if (bullet.type === 'grenade') {
      ctx.fillStyle = player.team === 1 ? 'purple' : "cyan";
    }
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  })
}

export function drawHealth(ctx, healths) {
  healths.forEach((health) => {
    ctx.fillStyle = "green";
    ctx.fillRect(health.x, health.y, dimensions.POINT_SIZE, dimensions.POINT_SIZE);
  })
}

export function drawAmmo(ctx, ammos) {
  ammos.forEach((ammo) => {
    ctx.fillStyle = "brown";
    ctx.fillRect(ammo.x, ammo.y, dimensions.POINT_SIZE, dimensions.POINT_SIZE);
  })
}

export function drawDebug(ctx, state) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 400, 70);
  state.players.forEach((player, idx) => {
    const targetDescription = ['enemy', 'fighting'].includes(player.target.type) ? state.players[player.enemy].name : player.target.type;
    
    ctx.fillStyle = 'black';
    ctx.fillText(`${player.name}: health: ${player.health}, ammo:${player.ammo}, target: ${targetDescription}`, 10, (idx + 1) * 15, 2000);
  })
}