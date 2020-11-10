import { astar } from "./astar.js";
import { generateRandomRooms, intersects } from "./rooms.js";

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
  const fromNodeRoom = rooms.findIndex((room) => intersects(room, {
    x: pointA.x + 5,
    y: pointA.y + 5
  }));
  const toNodeRoom = rooms.findIndex((room) => intersects(room, {
    x: pointB.x + 5,
    y: pointB.y + 5
  }));

  return toNodeRoom >= 0 && fromNodeRoom >= 0 && fromNodeRoom === toNodeRoom;
}

function pickNewTarget(player, players) {
  let randomPlayerIdx = -1;
  let randomPlayer = players[randomPlayerIdx];
  while (!randomPlayer || randomPlayer?.team === player.team || !randomPlayer.dead) {
    randomPlayerIdx = Math.floor(Math.random() * Math.floor(players.length));
    randomPlayer = players[randomPlayerIdx];
  }
  return randomPlayer;
}

function movePlayer(graph, player, players, rooms) {
  const toTarget = player.target;
  const fromNode = graph.grid[player.x][player.y];
  const toNode = graph.grid[toTarget.x][toTarget.y];

  if (player.dead) {
    return player;
  }

  const fromNodeRoom = rooms.find((room) => intersects(room, {
    x: fromNode.x + 5,
    y: fromNode.y + 5
  }));
  const toNodeRoom = rooms.find((room) => intersects(room, {
    x: toNode.x + 5,
    y: toNode.y + 5
  }));

  // In order for player not to meet inside a corridor
  const targetIsTransferringRooms = toNodeRoom === undefined;
  const targetInSameRoom = toNodeRoom && fromNodeRoom && fromNodeRoom.x1 === toNodeRoom.x1;
  if (targetIsTransferringRooms) {
    const roomsAlongPath = (player.entirePath || []).reduce((pathRooms, point) => {
      const maybeRoom = rooms.find((room) => intersects(room, point));
      if (maybeRoom) {
        pathRooms.add(maybeRoom)
      }
      return pathRooms;
    }, new Set());
    if (roomsAlongPath.size <= 2) {
      // return player;
    }
  }

  const shouldStand = targetInSameRoom;

  if (toTarget.type === 'enemy' && shouldStand) {
    // return player;
  }

  let path;
  let entirePath = player.entirePath || [];
  if (player.path && player.path.length > 0) {
    path = player.path
  } else {
    path = astar.search(graph, fromNode, toNode);
    entirePath = path;
  }

  if (path.length) {
    const nextStep = path[0];
    return {
      ...player,
      path: path.slice(1, 100),
      entirePath,
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
    ammo: state.ammo.filter((_, idx) => !ammoTaken.includes(idx)),
  };
}

function maybeUpdatePlayerHealth(state) {
  const bullets = state.players.reduce((acc, player, idx) => {
    return player.bullet ? [...acc, { ...player.bullet, from: idx }] : acc;
  }, []);
  let hittingBulletsPlayers = new Set();
  const playersWithUpdatedHealth = state.players.map((player, idx) => {
    const hittingBullets = bullets.filter((bullet) => {
      const shootingPlayer = state.players[bullet.from];
      return idx !== bullet.from && player.team !== shootingPlayer.team && intersects({
        x1: player.x,
        y1: player.y,
        x2: player.x + 20,
        y2: player.y + 20,
      }, bullet);
    }).map((bullet) => bullet.from);
    hittingBulletsPlayers.add(...hittingBullets);

    return {
      ...player,
      health: player.health - hittingBullets.length * 10,
    }
  })

  return {
    ...state,
    players: playersWithUpdatedHealth.map((player, idx) => {
      return hittingBulletsPlayers.has(idx) ? { ...player, bullet: undefined } : player;
    }).map((player) => player.health > 0 ? player : {
      ...player,
      dead: true
    })
  }
}

function maybeShootBullets(state) {
  const players = state.players;

  const playersWithShotBullets = players.map((player, idx) => {
    const target = player.target;
    if (player.ammo > 0 && !player.dead && target.type === 'fighting' && target.health > 0 && !player.bullet && inSameRoom(player, target, state.rooms)) {
      const targetY = target.y + 5;
      const targetX = target.x + 5;
      const bulletX = player.x + 5;
      const bulletY = player.y + 5;
      const slope = (targetY - bulletY) / (targetX - bulletX);
      const direction = targetX !== bulletX
        ? Math.atan(slope)
        : (bulletY > targetY ? 1/2 * Math.PI : 3/2 * Math.PI);
      const directionX = (bulletX > targetX ? -1 : 1) * Math.cos(direction);
      const directionY = (bulletY > targetY ? 1 : -1) * Math.sin(direction);
      const directionYForEqualX = (bulletY > targetY ? -1 : 1);

      return {
        ...player,
        ammo: player.ammo - 1,
        bullet: {
          x: bulletX,
          y: bulletY,
          direction: {
            x: directionX,
            y: bulletX === targetX ? directionYForEqualX : directionY
          }
        }
      }
    }

    return player;
  });

  return {
    ...state,
    players: playersWithShotBullets
  }
}

function updateBulletsPositions(state) {
  return {
    ...state,
    players: state.players.map((player, playerIdx, players) => {
      const bullet = player.bullet;
      if (bullet) {
        const nextBulletPosition = {
          x: bullet.x + bullet.direction.x,
          y: bullet.y + bullet.direction.y,
        };

        const bulletOutOfBounds = state.rooms.every((room) => !intersects(room, nextBulletPosition));

        return {
          ...player,
          bullet: bulletOutOfBounds ? undefined : {
            ...bullet,
            ...nextBulletPosition,
          },
        };
      } else {
        return player;
      }
    }),
  };
}

function computeDistance(pointA, pointB) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

function findClosestRoom(rooms, point) {
  let distance = Infinity;
  let closestRoom;
  rooms.forEach((room) => {
    const roomX = Math.floor((room.x2 + room.x1)/2);
    const roomY = Math.floor((room.y2 + room.y1)/2);
    const distanceToRoom = computeDistance(point, {x: roomX, y: roomY});
      // Math.abs(point.x - roomX) + Math.abs(point.y - roomY);
    if (distanceToRoom < distance) {
      distance = distanceToRoom;
      closestRoom = {x: roomX, y: roomY};
    }
  })

  return closestRoom;
}

function maybeUpdateTargets(state) {
  const updatedPlayers = state.players.map((player, idx, players) => {
    if (player.health < 50 && state.health.length > 0) {
      return {
        ...player,
        target: {
          ...state.health[0],
          type: 'health'
        },
      }
    } else if (player.ammo === 0 && state.ammo.length) {
      if (player.target.type === 'ammo' && !(player.x === player.target.x && player.y === player.target.y)) {
        return player;
      }
      let closest = Infinity;
      const closestAmmo = state.ammo.reduce((closeAmmo, currAmmo) => {
        const distance = Math.abs(player.x - currAmmo.x) + Math.abs(player.y - currAmmo.y);
        if (distance < closest) {
          closest = distance;
          closeAmmo = currAmmo;
        }
        return closeAmmo;
      }, undefined);
      return {
        ...player,
        target: {
          ...closestAmmo,
          type: 'ammo'
        }
      }
    } else if ((player.target.type === 'enemy' || player.target.type === 'fighting') && !state.players[player.enemy].dead && player.entirePath && player.entirePath.length < 500) {
      const closestRoomToMe = findClosestRoom(state.rooms, player);
      const closestRoomToEnemy = findClosestRoom(state.rooms, state.players[player.enemy]);

      const distanceToMyRoom = computeDistance(player, closestRoomToMe);
      const distanceToEnemyRoom = computeDistance(state.players[player.enemy], closestRoomToEnemy);

      const roomToGoto = distanceToMyRoom < distanceToEnemyRoom ? (
        closestRoomToMe
      ) : closestRoomToEnemy;

      return {
        ...player,
        target: {
          type: 'fighting',
          ...roomToGoto
        }
      }
    } else {
      const playerIdx = players[player.enemy].dead ? players.findIndex((onePlayer) => {
        return onePlayer.team !== player.team && !onePlayer.dead;
      }) : player.enemy;
      if (playerIdx === -1) {
        return {
          ...player,
          target: {
            type: 'done',
            x: 0,
            y: 0,
          }
        }
      }
      return {
        ...player,
        enemy: playerIdx,
        target: {
          type: 'enemy',
          ...players[playerIdx]
        },
      };
    }
  });
  return {
    ...state,
    players: updatedPlayers
  }
}

export function update(state) {
  const stateWithNewPositions = movePlayers(state);
  const stateWithUpdatedHealth = maybeTakeHealth(stateWithNewPositions);
  const stateWithUpdatedAmmo = maybeTakeAmmo(stateWithUpdatedHealth);
  const stateWithUpdatedPlayerHealth = maybeUpdatePlayerHealth(stateWithUpdatedAmmo);
  const stateWithUpdatedTargets = maybeUpdateTargets(stateWithUpdatedPlayerHealth);
  const stateWithShotBullets = maybeShootBullets(stateWithUpdatedTargets);
  const stateWithUpdatedBullets = updateBulletsPositions(stateWithShotBullets);

  return stateWithUpdatedBullets;
}
