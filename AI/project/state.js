import { astar } from "./astar.js";
import { FLOOR, WALL } from "./constants.js";
import { isPointInRoom, computeDistance, findClosestPoint, randomPointInRoom, inSameRoom, getCurrentRoom } from './geometry.js';
import { createBullet, createGrenade } from './builders.js';

function movePlayers(state) {
  return {
    ...state,
    players: state.players.map((player) => {
      return player.dead ? player : movePlayer(state.graph, player);
    }),
  };
}



function movePlayer(graph, player) {
  const playerNode = graph.grid[player.x][player.y];
  const targetNode = graph.grid[player.target.x][player.target.y];

  const path = player.path.length
    ? player.path
    : astar(graph, playerNode, targetNode);
  const distanceToTarget = Math.floor(computeDistance(playerNode, targetNode));
  const nextStep = path[0];

  return {
    ...player,
    path: path.slice(1, distanceToTarget),
    x: nextStep.x,
    y: nextStep.y,
  };
}

function maybeTakeHealth(state) {
  const players = state.players;
  const healthTaken = [];
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
  const ammoTaken = [];
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
    let damage = 0;
    const hittingBullets = state.bullets
      .map((bullet, bulletIdx) => {
        const shootingPlayer = state.players[bullet.from];
        const isFriendlyFire = player.team === shootingPlayer.team;
        const bulletHitsPlayer = isPointInRoom(
          {
            x1: player.x,
            y1: player.y,
            x2: player.x + 20,
            y2: player.y + 20,
          },
          bullet
        );

        if (!isFriendlyFire && bulletHitsPlayer && bullet.type !== "grenade") {
          damage += bullet.damage;
          return bulletIdx;
        }
      })
      .filter((bulletIdx) => {
        return bulletIdx >= 0;
      });

    hittingBulletsIdxs.add(...hittingBullets);

    return {
      ...player,
      health: player.health - Math.round(damage),
    };
  });

  return {
    ...state,
    bullets: state.bullets.filter(
      (_, bulletIdx) => !hittingBulletsIdxs.has(bulletIdx)
    ),
    players: playersWithUpdatedHealth,
  };
}

function maybeShootBullets(state) {
  const players = state.players;
  const newBulletsShot = players.reduce((newBullets, player, idx) => {
    const playerHasActiveBullets = state.bullets.find(
      (bullet) => bullet.from === idx
    );
    const cooldownOver = player.cooldown === 0;
    const isFighting = player.target.type === "fighting";
    const target = players[player.enemy];
    const distanceToTarget = computeDistance(player, target);

    if (
      !playerHasActiveBullets &&
      cooldownOver &&
      !player.dead &&
      player.ammo > 0 &&
      isFighting &&
      inSameRoom(player, target, state.rooms)
    ) {
      if (distanceToTarget < 100) {
        return [...newBullets, createGrenade(player, target, idx)];
      } else {
        return [...newBullets, createBullet(player, target, idx)];
      }
    }

    return newBullets;
  }, []);

  const updatedPlayers = state.players.map((player, idx) => {
    return newBulletsShot.find((bullet) => bullet.from === idx)
      ? { ...player, ammo: player.ammo - 1, cooldown: 120 }
      : player;
  });

  return {
    ...state,
    bullets: [...state.bullets, ...newBulletsShot],
    players: updatedPlayers,
  };
}

function updateBulletsPositions(state) {
  return {
    ...state,
    bullets: state.bullets.map((bullet) => {
      const nextBulletPosition = {
        x: bullet.x + bullet.direction.x,
        y: bullet.y + bullet.direction.y,
      };

      return { ...bullet, ...nextBulletPosition, damage: bullet.damage - 0.05 };
    }),
  };
}

function removeOutOfBoundsBullets(state) {
  const grenades = state.bullets.filter((bullet) => bullet.type === "grenade");

  const outOfBoundsGrenades = grenades.filter((grenade) => {
    const bulletOutOfBounds = state.graph.grid[Math.floor(grenade.x)][Math.floor(grenade.y)].weight === WALL;
    return bulletOutOfBounds;
  });

  const bouncedGrenades = outOfBoundsGrenades.map((grenade) => {
    return {
      ...grenade,
      x: grenade.x + grenade.direction.x * -1,
      y: grenade.y + grenade.direction.y * -1,
      direction: {
        x: grenade.direction.x * -1,
        y: grenade.direction.y * -1,
      },
    };
  });

  const inBoundsBullets = state.bullets.filter((bullet) => {
    const bulletOutOfBounds =
      state.graph.grid[Math.floor(bullet.x)][Math.floor(bullet.y)]
        .weight === WALL;
    return !bulletOutOfBounds;
  });

  return {
    ...state,
    bullets: [
      ...bouncedGrenades,
      ...inBoundsBullets,
    ],
  };
}

function findClosestRoom(rooms, point) {
  return findClosestPoint(
    rooms.map((room) => {
      return {
        x: Math.floor((room.x2 + room.x1) / 2),
        y: Math.floor((room.y2 + room.y1) / 2),
      };
    }),
    point
  );
}

function updatePlayersCooldowns(state) {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      cooldown: player.cooldown === 0 ? 0 : player.cooldown - 1,
    })),
  };
}

function maybeKillPlayers(state) {
  return {
    ...state,
    players: state.players.map((player) => {
      return {
        ...player,
        dead: player.health <= 0,
        health: player.health <= 0 ? 0 : player.health,
      };
    }),
  };
}

function explodeGrenades(state) {
  const grenadesToExplode = state.bullets.filter(
    (bullet) => bullet.type === "grenade" && bullet.damage <= 0
  );
  const regularBullets = state.bullets.filter(
    (bullet) => bullet.type !== "grenade" || bullet.damage > 0
  );
  const bulletsFromGrenades = grenadesToExplode.reduce((bullets, grenade) => {
    let newBullets = [];
    for (let angle = 0; angle < 360; angle += 360 / 5) {
      const theta = angle * (Math.PI / 180);
      const dx = Math.cos(theta) * 500;
      const dy = Math.sin(theta) * 500;
      const target = { x: grenade.x + dx, y: grenade.y + dy };
      newBullets.push(createBullet(grenade, target, grenade.from));
    }

    return [...bullets, ...newBullets];
  }, []);

  return {
    ...state,
    bullets: [...regularBullets, ...bulletsFromGrenades],
  };
}

function maybeSpawnAmmo(state) {
  if (state.ammo.length < 10) {
    const randomRoomIdx = Math.floor(Math.random() * state.rooms.length);
    return {
      ...state,
      ammo: [
        ...state.ammo,
        ...new Array(10).fill(0).map(() => ({
          ...randomPointInRoom(state.rooms[randomRoomIdx], state.graph.grid),
          ammo: 5,
        })),
      ],
    };
  } else {
    return state;
  }
}

export function maybeUpdatePlayerTargets(state) {
  const updatedPlayers = state.players.map((player, idx, players) => {
    const targetType = player.target ? player.target.type : 'unset';
    const playerNeedsHealth = player.health <= player.character.minHealth;
    const healthAvailable = state.health.length > 0;
    const playerNeedsAmmo = player.ammo <= player.character.minAmmo;
    const ammoAvailable = state.ammo.length > 0;
    const isPlayerCloseToTarget = player.target && computeDistance(player, player.target) < 500;
    const targetInSameRoom = player.target && inSameRoom(player, player.target, state.rooms);

    // Search for health
    if (playerNeedsHealth && healthAvailable) {
      const closestHealth = findClosestPoint(state.health, player);
      return {
        ...player,
        target: {
          ...closestHealth,
          type: "health",
        },
      };
    }
    
    // Search for ammo
    if (playerNeedsAmmo && ammoAvailable) {
      const closestAmmo = findClosestPoint(state.ammo, player);
      return {
        ...player,
        target: {
          ...closestAmmo,
          type: "ammo",
        },
      };
    }
    
    if (targetType === 'unset') {
      return {
        ...player,
        target: {
          type: "enemy",
          ...state.players[player.enemy],
        },
      };
    }
    
    // switch targets
    if (player.target.dead) {
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
          type: "enemy",
          ...state.players[newEnemyIdx],
        },
      };
    }
    
    // Update enemy location
    if (targetType === "enemy" && !isPlayerCloseToTarget) {
      return {
        ...player,
        target: {
          type: "enemy",
          ...state.players[player.enemy],
        },
      };
    }
    
    // Find room to fight once close enought
    if (
      targetType === "enemy" &&
      isPlayerCloseToTarget &&
      !targetInSameRoom
    ) {
      const closestRoomToMe = findClosestRoom(state.rooms, player);
      const closestRoomToEnemy = findClosestRoom(
        state.rooms,
        state.players[player.enemy]
      );

      const distanceToMyRoom = computeDistance(player, closestRoomToMe);
      const distanceToEnemyRoom = computeDistance(
        state.players[player.enemy],
        closestRoomToEnemy
      );

      const roomToGoto =
        distanceToMyRoom < distanceToEnemyRoom
          ? closestRoomToMe
          : closestRoomToEnemy;

      return {
        ...player,
        target: {
          type: "enemy",
          ...roomToGoto,
        },
      };
    }
    
    if (targetInSameRoom) {
      const currentRoom = getCurrentRoom(player, state.rooms);

      const randomPointCandidates = [];
      do {
        const {x, y} = randomPointInRoom(currentRoom, state.graph.grid);
        // Make sure players can walk to random point
        if (state.graph.grid[x][y].weight === FLOOR) {
          randomPointCandidates.push({ x, y });
        }
      } while (randomPointCandidates.length < 10);

      const safestPoint = randomPointCandidates.reduce((safest, point) => {
        if (state.securityMap[point.x][point.y] < state.securityMap[point.x][point.y]) {
          return point;
        } else {
          return safest;
        }
      }, randomPointCandidates[0]);

      return {
        ...player,
        target: {
          type: "fighting",
          ...safestPoint,
        },
      };
    }
    
    return {
      ...player,
      target: {
        type: "enemy",
        ...state.players[player.enemy],
      },
    };
  });

  return {
    ...state,
    players: updatedPlayers,
  };
}

export function update(state) {
  let newState = {...state};
  newState = maybeUpdatePlayerTargets(newState);
  newState = movePlayers(newState);
  newState = maybeTakeHealth(newState);
  newState = maybeTakeAmmo(newState);
  newState = maybeHitPlayers(newState);
  newState = maybeKillPlayers(newState);
  newState = maybeShootBullets(newState);
  newState = updateBulletsPositions(newState);
  newState = explodeGrenades(newState);
  newState = removeOutOfBoundsBullets(newState);
  newState = updatePlayersCooldowns(newState);
  newState = maybeSpawnAmmo(newState);

  return newState;
}
