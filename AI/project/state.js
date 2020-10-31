import { astar } from "./astar.js";
import { intersects } from "./rooms.js";

function movePlayers(state) {
  const movedPlayers = state.players.map((player) => {
    return movePlayer(state.graph, player, state.players, state.rooms);
  });
  return {
    ...state,
    players: movedPlayers,
  };
}

function inSameRoom(pointA, pointB, rooms) {
  const fromNodeRoom = rooms.find((room) => intersects(room, pointA));
  const toNodeRoom = rooms.find((room) => intersects(room, pointB));

  return toNodeRoom && fromNodeRoom && fromNodeRoom.x1 === toNodeRoom.x1;
}

function movePlayer(graph, player, players, rooms) {
  const toTarget = player.target;
  const fromNode = graph.grid[player.x][player.y];
  const toNode = graph.grid[toTarget.x][toTarget.y];

  const fromNodeRoom = rooms.find((room) => intersects(room, fromNode));
  const toNodeRoom = rooms.find((room) => intersects(room, toNode));

  // In order for player not to meet inside a corridor
  const targetIsTransferringRooms = toNodeRoom === undefined;
  const targetInSameRoom =
    toNodeRoom && fromNodeRoom && fromNodeRoom.x1 === toNodeRoom.x1;
  const shouldStand = targetIsTransferringRooms || targetInSameRoom;
  if (toTarget.type !== 'health' && shouldStand) return player;

  const path = astar.search(graph, fromNode, toNode);

  if (path.length) {
    const nextStep = path[0];
    return {
      ...player,
      x: nextStep.x,
      y: nextStep.y,
    };
  } else {
    return player;
  }
}

function maybeTakeHealth(state) {
  const players = state.players;
  let healthTaken = [];
  const playersWithUpdatedHealth = players.map((player) => {
    const maybeHealthNodeIdx = state.health.findIndex(
      (node) => node.x === player.x && node.y === player.y
    );
    if (maybeHealthNodeIdx >= 0) {
      healthTaken.push(maybeHealthNodeIdx);
    }
    const newHealth =
      maybeHealthNodeIdx >= 0
        ? player.health + state.health[maybeHealthNodeIdx].health
        : player.health;
    return {
      ...player,
      health: newHealth,
    };
  });

  return {
    ...state,
    players: playersWithUpdatedHealth,
    health: state.health.filter((_, idx) => !healthTaken.includes(idx)),
  };
}

function maybeTakeAmmo(state) {
  const players = state.players;
  let ammoTaken = [];
  const playersWithUpdatedAmmo = players.map((player) => {
    const maybeAmmoNodeIdx = state.ammo.findIndex(
      (node) => node.x === player.x && node.y === player.y
    );
    if (maybeAmmoNodeIdx >= 0) {
      ammoTaken.push(maybeAmmoNodeIdx);
    }
    const newAmmo =
      maybeAmmoNodeIdx >= 0
        ? player.ammo + state.ammo[maybeAmmoNodeIdx].ammo
        : player.ammo;
    return {
      ...player,
      ammo: newAmmo,
    };
  });

  return {
    ...state,
    players: playersWithUpdatedAmmo,
    ammo: state.health.filter((_, idx) => !ammoTaken.includes(idx)),
  };
}

function isInRoom(room, player) {
  return (
    room.x1 <= player.x &&
    room.x2 >= player.x &&
    room.y1 <= player.y &&
    room.y2 >= player.y
  );
}

function maybeUpdatePlayerHealth(state) {
    const bullets = state.players.reduce((acc, player) => {
        return player.bullet ? [...acc, {...player.bullet, from: player.name}] : acc;
    }, []);
    const playersWithUpdatedHealth = state.players.map((player) => {
        const hittingBullets = bullets.filter((bullet) => {
            return bullet.from !== player.name && intersects({
                x1: player.x - 5,
                  y1: player.y - 5,
                  x2: player.x + 15,
                  y2: player.y + 15,
            }, bullet);
        });

        if (hittingBullets.length) {
            return {
                ...player,
                health: player.health - hittingBullets.length * 10,
            }
        } else {
            return player;
        }
    })

    return {
        ...state,
        players: playersWithUpdatedHealth
    }
}

export function update(state) {
  const stateWithNewPositions = movePlayers(state);
  const stateWithUpdatedHealth = maybeTakeHealth(stateWithNewPositions);
  const stateWithUpdatedAmmo = maybeTakeAmmo(stateWithUpdatedHealth);

  const stateWithUpdatedPlayerHealth = maybeUpdatePlayerHealth(stateWithUpdatedAmmo);

  const stateWithUpdatedBullets = {
    ...stateWithUpdatedPlayerHealth,
    players: stateWithUpdatedPlayerHealth.players.map((player, playerIdx, players) => {
      const target = player.target;
      if (target.type !== 'enemy') {
          return player;
      }
      if (inSameRoom(player, target, stateWithUpdatedAmmo.rooms)) {
        const bullet = player.bullet;
        if (bullet) {
          const direction =
            bullet.direction ||
            Math.atan(
              (bullet.targetY - bullet.y) / (bullet.targetX - bullet.x)
            );
          if (!bullet.direction) {
            console.log(direction);
          }
          bullet.direction = direction;

          const nextBulletPosition = {
            x:
              bullet.x +
              (bullet.x > bullet.targetX ? -1 : 1) * Math.cos(direction),
            y:
              bullet.y +
              (bullet.y > bullet.targetY ? 1 : -1) * Math.sin(direction),
          };

          const hit = players.find((player, idx) => {
            return (
              idx != playerIdx &&
              intersects(
                {
                  x1: player.x - 5,
                  y1: player.y - 5,
                  x2: player.x + 15,
                  y2: player.y + 15,
                },
                bullet
              )
            );
          });

          return {
            ...player,
            bullet: hit ? undefined : {
              ...bullet,
              ...nextBulletPosition,
            },
          };
        } else {
          return {
            ...player,
            bullet: {
              x: player.x + 5,
              y: player.y + 5,
              targetX: target.x + 5,
              targetY: target.y + 5,
            },
          };
        }
      } else {
        return player;
      }
    }),
  };

  const updatedTargets = stateWithUpdatedBullets.players.map((player, idx, players) => {
      if (player.health < 50 && stateWithUpdatedBullets.health.length > 0) {
          return {
              ...player,
              target: {
                  ...stateWithUpdatedBullets.health[0],
                  type: 'health'
                },
          }
      } else {
          return {
              ...player,
              target: {
                  type: 'enemy',
                  ...players[player.enemy]
                },
            };
      }
  })

  return {
      ...stateWithUpdatedBullets,
      players: updatedTargets.filter((player) => {
        return player.health > 0;
      })
  }
}
