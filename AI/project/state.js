import { astar } from "./astar.js";
import { WALL } from "./constants.js";
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

function getCurrentRoom(point, rooms) {
  return rooms.find((room) => intersects(room, {
    x: point.x + 5,
    y: point.y + 5
  }));
};

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

function movePlayer(graph, player, players, rooms) {
  if (player.dead) {
    return player;
  }

  const toTarget = player.target;
  const fromNode = graph.grid[player.x][player.y];
  const toNode = graph.grid[toTarget.x][toTarget.y];


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

function maybeHitPlayers(state) {
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
    const target = players[player.enemy];

    if (player.cooldown === 0 && player.ammo > 0 && player.target.type === 'fighting' && !player.bullet && inSameRoom(player, target, state.rooms)) {
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
        // 3 seconds
        cooldown: 1 * 120,
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

    return {
      ...player,
      cooldown: player.cooldown > 0 ? player.cooldown - 1 : 0,
    };
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

        const bulletOutOfBounds = state.graph.grid[Math.floor(nextBulletPosition.x)][Math.floor(nextBulletPosition.y)].weight === WALL;// state.rooms.every((room) => !intersects(room, nextBulletPosition));

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
  // let distance = Infinity;
  // let closestRoom;
  // rooms.forEach((room) => {
  //   const roomX = Math.floor((room.x2 + room.x1)/2);
  //   const roomY = Math.floor((room.y2 + room.y1)/2);
  //   const distanceToRoom = computeDistance(point, {x: roomX, y: roomY});
  //     // Math.abs(point.x - roomX) + Math.abs(point.y - roomY);
  //   if (distanceToRoom < distance) {
  //     distance = distanceToRoom;
  //     closestRoom = {x: roomX, y: roomY};
  //   }
  // })

  return findClosestPoint(rooms.map((room) => {
    return {
      x: Math.floor((room.x2 + room.x1)/2),
      y: Math.floor((room.y2 + room.y1)/2)
    }
  }), point);

  // return closestRoom;
}

function findClosestPoint(candidatePoints, centerPoint) {
  let distance = Infinity;
  let closestPoint;
  candidatePoints.forEach((candidatePoint) => {
    const distanceToPoint = computeDistance(centerPoint, candidatePoint);
    if (distanceToPoint < distance) {
      distance = distanceToPoint;
      closestPoint = candidatePoint;
    }
  })

  return closestPoint;
}

function randomInRange(from, to) {
  return Math.floor((Math.random() * (to - from)) + from);
}

export function maybeUpdatePlayerTargets(state) {
  const updatedPlayers = state.players.map((player, idx, players) => {

    const targetType = player.target.type;
    const playerNeedsHealth = player.health < 50;
    const healthAvailable = state.health.length > 0;
    const playerNeedsAmmo = player.ammo === 0;
    const ammoAvailable = state.ammo.length > 0;
    const isPlayerCloseToTarget = player.entirePath.length < 500;
    const targetInSameRoom = inSameRoom(player, player.target, state.rooms);

    // Search for health
    if (playerNeedsHealth && healthAvailable) {
      const closestHealth = findClosestPoint(state.health, player);
      return {
        ...player,
        target: {
          ...closestHealth,
          type: 'health'
        },
      }
    // Search for ammo
    } else if (playerNeedsAmmo && ammoAvailable) {
      const closestAmmo = findClosestPoint(state.ammo, player)
      return {
        ...player,
        target: {
          ...closestAmmo,
          type: 'ammo'
        }
      }
    // switch targets
    } else if (player.target.dead) {
      const newEnemyIdx = state.players.findIndex((otherPlayer) => {
        return otherPlayer.team != player.team && !otherPlayer.dead;
      });

      if (newEnemyIdx === -1) {
        return player;
      }

      return {
        ...player,
        enemy: newEnemyIdx,
        target: {
          type: 'enemy',
          ...state.players[newEnemyIdx]
        }
      }
    // Update enemy location
    } else if (targetType === 'enemy' && !isPlayerCloseToTarget) {
      return {
        ...player,
        target: {
          type: 'enemy',
          ...state.players[player.enemy]
        }
      }
    // Find room to fight once close enought
    } else if (targetType === 'enemy' && isPlayerCloseToTarget) {
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
    } else if (targetInSameRoom) {
      
      const currentRoom = getCurrentRoom(player, state.rooms);

      const randomX = randomInRange(currentRoom.x1, currentRoom.x2);
      const randomY = randomInRange(currentRoom.y1, currentRoom.y2);

      return {
        ...player,
        target: {
          type: 'enemy',
          x: randomX,
          y: randomY
        }
      };
    } else {
      (idx, 'WAT');
      return {
        ...player,
        target: {
          type: 'enemy',
          ...state.players[player.enemy]
        }
      }
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
  const stateWithUpdatedPlayerHealth = maybeHitPlayers(stateWithUpdatedAmmo);
  const stateWithUpdatedTargets = maybeUpdatePlayerTargets(stateWithUpdatedPlayerHealth);
  const stateWithShotBullets = maybeShootBullets(stateWithUpdatedTargets);
  const stateWithUpdatedBullets = updateBulletsPositions(stateWithShotBullets);

  return stateWithUpdatedBullets;
}
