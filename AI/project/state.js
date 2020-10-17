// import {astar} from "./astar.js";

function movePlayers(state) {
    const movedPlayers = state.players.map((player) => movePlayer(state.graph, player))
    return {
        ...state,
        players: movedPlayers
    };
}

function movePlayer(graph, player) {
    const toTarget = player.target;
    const fromNode = graph.grid[player.x][player.y];
    const toNode = graph.grid[toTarget.x][toTarget.y];
    
    const path = astar.search(graph, fromNode, toNode).filter((node) => !(node.x === fromNode.x && node.y === fromNode.y));

    if (path.length) {
        const nextStep = path[0];
        return {
            ...player,
            x: nextStep.x,
            y: nextStep.y,
        }
    } else {
        return player;
    }
}

function maybeTakeHealth(state) {
    const players = state.players;
    let healthTaken = [];
    const playersWithUpdatedHealth = players.map((player) => {
        const maybeHealthNodeIdx = state.health.findIndex((node) => node.x === player.x && node.y === player.y);
        if (maybeHealthNodeIdx >= 0) {
            healthTaken.push(maybeHealthNodeIdx);
        }
        const newHealth = maybeHealthNodeIdx >= 0 ? player.health + state.health[maybeHealthNodeIdx].health : player.health
        return {
            ...player,
            health: newHealth
        }
    })
    
    return {
        ...state,
        players: playersWithUpdatedHealth,
        health: state.health.filter((_, idx) => !healthTaken.includes(idx))
    };
}

function maybeTakeAmmo(state) {
    const players = state.players;
    let ammoTaken = [];
    const playersWithUpdatedAmmo = players.map((player) => {
        const maybeAmmoNodeIdx = state.ammo.findIndex((node) => node.x === player.x && node.y === player.y);
        if (maybeAmmoNodeIdx >= 0) {
            ammoTaken.push(maybeAmmoNodeIdx);
        }
        const newAmmo = maybeAmmoNodeIdx >= 0 ? player.ammo + state.ammo[maybeAmmoNodeIdx].ammo : player.ammo
        return {
            ...player,
            ammo: newAmmo
        }
    })
    
    return {
        ...state,
        players: playersWithUpdatedAmmo,
        ammo: state.health.filter((_, idx) => !ammoTaken.includes(idx))
    };
}

function isInRoom(room, player) {
    return room.x1 <= player.x &&
        room.x2 >= player.x &&
        room.y1 <= player.y &&
        room.y2 >= player.y;
}

export function update(state) {
    const stateWithNewPositions = movePlayers(state);
    const stateWithUpdatedHealth = maybeTakeHealth(stateWithNewPositions);
    const stateWithUpdatedAmmo = maybeTakeAmmo(stateWithUpdatedHealth);

    // const player1Room = state.rooms.findIndex((room) => isInRoom(room, state.players[0]));
    // const player2Room = state.rooms.findIndex((room) => isInRoom(room, state.players[1]));
    // const notSameRoom = (player1Room === -1 || player2Room === -1) || player1Room !== player2Room;

    return stateWithUpdatedAmmo;
}