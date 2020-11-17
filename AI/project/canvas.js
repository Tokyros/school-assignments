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
    ctx.fillRect(node.x, node.y, dims.POINT_SIZE, dims.POINT_SIZE);
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
    ctx.fillRect(player.x, player.y, dims.POINT_SIZE, dims.POINT_SIZE);
    ctx.fillStyle = "white";
    ctx.fillText(`${idx + 1}`, player.x + 5, player.y + 10);
    ctx.fillText(`${player.health}`, player.x + 5, player.y + 15);
  });
}

export function drawBullets(ctx, bullets, players) {
  bullets.forEach((bullet) => {
    const player = players.find((_, idx) => idx === bullet.from);
    ctx.fillStyle = player.team === 1 ? "red" : "blue";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  })
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

function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  context.stroke();
}

export function drawDebug(ctx, state) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 400, 70);
  state.players.forEach((player, idx) => {
    const room = state.rooms.findIndex((room) => intersects(room, player));
    
    ctx.fillStyle = 'black';
    ctx.fillText(`${player.name}: ammo:${player.ammo}, ${player.target.type}, target: {x: ${player.target.x}, y: ${player.target.y}}, dead?: ${player.dead}`, 10, (idx + 1) * 15, 2000);
  })

  // ctx.fillStyle = 'black';

  // ctx.fillRect(state.rooms[0].x1 + 10, state.rooms[0].y1 + 10, 10, 10);
  // ctx.fillRect(state.rooms[0].x1 + 10, state.rooms[0].y1 + 30, 10, 10);
  // ctx.strokeStyle = 'red';
  // canvas_arrow(ctx, state.rooms[0].x1 + 10, state.rooms[0].y1 + 30, state.rooms[0].x1 + 10, state.rooms[0].y1 + 10)
}