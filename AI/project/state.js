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
  let hittingBulletsIdxs = new Set();
  const playersWithUpdatedHealth = state.players.map((player) => {
    const hittingBullets = state.bullets.map((bullet, bulletIdx) => {
      const shootingPlayer = state.players[bullet.from];
      const isFriendlyFire = player.team === shootingPlayer.team;
      const bulletHitsPlayer = intersects({
        x1: player.x,
        y1: player.y,
        x2: player.x + 20,
        y2: player.y + 20,
      }, bullet);

      // console.log(`hits: ${bulletHitsPlayer}`);
      
      return !isFriendlyFire && bulletHitsPlayer ? bulletIdx : undefined;
    }).filter(bulletIdx => {
      console.log(`idx: ${bulletIdx}`)
      return bulletIdx >= 0
    });

    hittingBulletsIdxs.add(...hittingBullets);

    return {
      ...player,
      health: player.health - hittingBullets.length * 10,
    }
  })

  return {
    ...state,
    bullets: state.bullets.filter((_, bulletIdx) => !hittingBulletsIdxs.has(bulletIdx)),
    players: playersWithUpdatedHealth
  }
}

function maybeShootBullets(state) {
  const players = state.players;
  const newBulletsShot = players.reduce((newBullets, player, idx) => {
    const target = players[player.enemy];
    
    const playerHasActiveBullets = state.bullets.find((bullet) => bullet.from === idx);

    if (!playerHasActiveBullets && player.cooldown === 0 && !player.dead && player.ammo > 0 && player.target.type === 'fighting' && inSameRoom(player, target, state.rooms)) {
      const targetY = target.y + 5;
      const targetX = target.x + 5;
      const bulletX = player.x + 5;
      const bulletY = player.y + 5;

      const dx = targetX - player.x;
      const dy = targetY - player.y;
      const angle = Math.atan2(dy, dx);

      const directionX = Math.cos(angle);
      const directionY =  Math.sin(angle);

      const bullet = {
        from: idx,
        x: bulletX,
        y: bulletY,
        direction: {
          x: directionX,
          y: directionY
        }
      };

      return [...newBullets, bullet];
    }

    return newBullets;
  }, []);

  const updatedPlayers = state.players.map((player, idx) => {
    return newBulletsShot
      .find((bullet) => bullet.from === idx)
        ? {...player, ammo: player.ammo - 1, cooldown: 120}
        : player;
  })

  return {
    ...state,
    bullets: [...state.bullets, ...newBulletsShot],
    players: updatedPlayers
  }
}

function updateBulletsPositions(state) {
  return {
    ...state,
    bullets: state.bullets.map((bullet) => {
      const nextBulletPosition = {
        x: bullet.x + bullet.direction.x,
        y: bullet.y + bullet.direction.y,
      };

      return {...bullet, ...nextBulletPosition};

    }),
  };
}

function removeOutOfBoundsBullets(state) {
  return {
    ...state,
    bullets: state.bullets.filter((bullet) => {
      const bulletOutOfBounds = state.graph.grid[Math.floor(bullet.x)][Math.floor(bullet.y)].weight === WALL;
      return !bulletOutOfBounds;
    })
  }
}

function computeDistance(pointA, pointB) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

function findClosestRoom(rooms, point) {
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
    } else if (targetType === 'enemy' && isPlayerCloseToTarget && !targetInSameRoom) {
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
          type: 'enemy',
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
          type: 'fighting',
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

function updatePlayersCooldowns(state){
  return {
    ...state,
    players: state.players.map((player) => ({...player, cooldown: player.cooldown === 0 ? 0 : player.cooldown - 1}))
  }
}

function maybeKillPlayers(state) {
  return {
    ...state,
    players: state.players.map((player) => {
      return {
        ...player,
        dead: player.health <= 0,
        health: player.health <= 0 ? 0 : player.health
      }
    })
  }
}

export function update(state) {
  const stateWithNewPositions = movePlayers(state);
  const stateWithUpdatedHealth = maybeTakeHealth(stateWithNewPositions);
  const stateWithUpdatedAmmo = maybeTakeAmmo(stateWithUpdatedHealth);
  const stateWithUpdatedPlayerHealth = maybeHitPlayers(stateWithUpdatedAmmo);
  const stateWithDeadPlayers = maybeKillPlayers(stateWithUpdatedPlayerHealth);
  const stateWithUpdatedTargets = maybeUpdatePlayerTargets(stateWithDeadPlayers);
  const stateWithShotBullets = maybeShootBullets(stateWithUpdatedTargets);
  const stateWithUpdatedBullets = updateBulletsPositions(stateWithShotBullets);
  const stateWithoutOutOfBoundsBullets = removeOutOfBoundsBullets(stateWithUpdatedBullets);
  const stateWithUpdatedPlayersCooldowns = updatePlayersCooldowns(stateWithoutOutOfBoundsBullets)

  return stateWithUpdatedPlayersCooldowns;
}
