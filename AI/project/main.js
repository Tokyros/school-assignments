import { dimensions, OBSTACLES, PASSAGES, PLAYERS, ROOMS } from "./constants.js";
import { update } from "./state.js";
import { drawAmmo, initCanvas, drawRooms, drawFloor, drawPlayers, drawBullets, drawHealth, drawDebug, drawObjects } from './canvas.js';
import { generateGraph } from './graph.js';
import { randomPointInRoom } from './geometry.js';
import { generateSecurityMap } from './security-map.js';

const ctx = initCanvas("cvs", dimensions.canvasWidth, dimensions.canvasHeight);

const graph = generateGraph(dimensions.canvasWidth, dimensions.canvasHeight, ROOMS, PASSAGES, OBSTACLES);

const ammo = new Array(ROOMS.length * 2).fill(0).map((_, idx) => ({
  ...randomPointInRoom(ROOMS[Math.floor(idx / 2)], graph.grid),
  ammo: 5
}));

const health = new Array(ROOMS.length * 2).fill(0).map((_, idx) => ({
  ...randomPointInRoom(ROOMS[Math.floor(idx / 2)], graph.grid),
  health: 20
}));

let state = {
  graph,
  players: PLAYERS,
  rooms: ROOMS,
  passages: PASSAGES,
  obstacles: OBSTACLES,
  bullets: [],
  health,
  ammo,
  securityMap: generateSecurityMap(graph, ROOMS, PASSAGES, OBSTACLES)
};

function getWinner(players) {
  if (players[0].dead && players[1].dead) {
    return "Team 2";
  } else if (players[2].dead && players[3].dead) {
    return "Team 1";
  } else {
    return;
  }
}

function main() {
	const timer = setInterval(() => {
    state = update(state);
    
    requestAnimationFrame(() => {
      drawRooms(ctx, state.rooms);
      drawFloor(ctx, state.passages);
      drawObjects(ctx, state.obstacles);
      drawPlayers(ctx, state.players);
      drawBullets(ctx, state.bullets, state.players);
      drawHealth(ctx, state.health);
      drawAmmo(ctx, state.ammo);
      drawDebug(ctx, state);
    });

    const maybeWinner = getWinner(state.players);
    if (maybeWinner) {
      clearInterval(timer);
      alert("The winner is - " + maybeWinner);
    }
	}, 1000 / 120);
}

confirm("Press anything to begin");
main();

