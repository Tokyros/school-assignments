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
  const fromNodeRoom = rooms.find((room) => intersects(room, {
    x: pointA.x + 5,
    y: pointA.y + 5
  }));
  const toNodeRoom = rooms.find((room) => intersects(room, {
    x: pointB.x + 5,
    y: pointA.y + 5
  }));
  console.log(fromNodeRoom, toNodeRoom)

  return toNodeRoom && fromNodeRoom && fromNodeRoom.x1 === toNodeRoom.x1;
}

function pickNewTarget(player, players) {
  let randomPlayerIdx = -1;
  let randomPlayer = players[randomPlayerIdx];
  while (!randomPlayer || randomPlayer?.team === player.team || !randomPlayer.dead) {
    randomPlayerIdx = Math.floor(Math.random() * Math.floor(players.length));
    console.log('IDX', randomPlayerIdx)
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
  const targetInSameRoom =
    toNodeRoom && fromNodeRoom && fromNodeRoom.x1 === toNodeRoom.x1;
  const shouldStand = targetIsTransferringRooms || targetInSameRoom;

  if (toTarget.type === 'done' || (toTarget.type !== 'health' && shouldStand)) {
    return player;
  }

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
  const bullets = state.players.reduce((acc, player, idx) => {
    return player.bullet ? [...acc, { ...player.bullet, from: idx }] : acc;
  }, []);
  let hittingBulletsPlayers = new Set();
  const playersWithUpdatedHealth = state.players.map((player, idx) => {
    const hittingBullets = bullets.filter((bullet) => {
      return idx !== bullet.from && intersects({
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
    if (!player.dead && target.type === 'enemy' && target.health > 0 && !player.bullet && inSameRoom(player, target, state.rooms)) {
      console.log(player.name + " Shot")
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
    } else {
      return {
        ...player,
        target: {
          type: 'enemy',
          ...players[player.enemy]
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
