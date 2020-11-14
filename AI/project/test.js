import { expect, it } from "@jest/globals";
import { Graph } from "./astar";
import { update, maybeUpdatePlayerTargets } from "./state";
import { connectRooms, intersects, generateRandomRooms } from "./rooms.js";
import { generateGraph } from "./graph";
import { dims } from "./constants";

export const rooms = generateRandomRooms(2, 10, 10, 40, 40);

const player1 = {
  x: rooms[0].x1 + 10,
  y: rooms[0].y1 + 10,
  target: 1,
};

const player2 = {
  x: rooms[1].x1 + 10,
  y: rooms[1].y1 + 10,
  target: 0,
};

// const player3 = {
//   x: rooms[2].x1 + 10,
//   y: rooms[2].y1 + 10,
//   target: player2,
// };

// const player4 = {
//   x: rooms[1].x1 + 10,
//   y: rooms[1].y1 + 10,
//   target: player3,
// };


// const freeForAllGraph = new Graph(
//   new Array(dims.canvasWidth).fill(0).map((_, x) =>
//     new Array(dims.canvasHeight).fill(0).map((_, y) => {
//       return rooms.some((room) => intersects(room, { x, y })) ? 1 : 99999999;
//     })
//   )
// );

// const defGraph = generateGraph(
//   dims.canvasWidth,
//   dims.canvasHeight,
//   rooms,
//   connectRooms(freeForAllGraph, rooms)
// );

// const defaultState = {
//   graph: new Graph([]),
//   players: [],
//   rooms: [],
//   health: [],
//   ammo: [],
// };

describe("game state", () => {
  it("moves players towards target", () => {
    const state = {
      ...defaultState,
      graph: defGraph,
      players: [player1, player2],
    };
    const expectedState = {
      ...state,
      players: [
        {
          x: 1,
          y: 0,
          target: { x: 1, y: 0 },
        },
        {
          x: 0,
          y: 1,
          target: { x: 0, y: 0 },
        },
      ],
    };

    expect(update(state)).toEqual(expectedState);
  });

  it("takes health", () => {
    const state = {
      ...defaultState,
      graph: new Graph([
        [1, 1],
        [1, 1],
      ]),
      players: [
        {
          x: 0,
          y: 0,
          target: { x: 0, y: 0 },
          health: 50,
        },
      ],
      health: [
        {
          x: 0,
          y: 0,
          health: 50,
        },
      ],
    };

    const newState = update(state);

    expect(newState.players[0].health).toBe(100);
    expect(newState.health.length).toBe(0);
  });

  it("takes ammo", () => {
    const state = {
      ...defaultState,
      graph: new Graph([
        [1, 1],
        [1, 1],
      ]),
      players: [
        {
          x: 0,
          y: 0,
          target: { x: 0, y: 0 },
          health: 50,
          ammo: 50,
        },
      ],
      ammo: [
        {
          x: 0,
          y: 0,
          ammo: 50,
        },
      ],
    };

    const newState = update(state);

    expect(newState.players[0].ammo).toBe(100);
  });

  it("takes a long walk", () => {
    const state = {
      graph: new Graph(new Array(30).fill(0).map(() => new Array(30).fill(1))),
      players: [
        player1,
        player2
      ],
      health: [],
      ammo: [],
    };

    let newState = state;
    for (let i = 0; i < 100; i++) {
      newState = update(newState);
    }

    expect(newState.players[0].x).toEqual(newState.players[1].x);
    expect(newState.players[0].y).toEqual(newState.players[1].y);
  });

  describe.only('Target', () => {
    it('updates target position when searching for enemy', () => {
      const state = {
        graph: new Graph(new Array(30).fill(0).map(() => new Array(30).fill(1))),
        players: [
          {
            ...player1,
            enemy: 1,
            target: {
              type: 'enemy',
              x: 10,
              y: 10
            }
          },
          {
            enemy: 0,
            ...player2,
            x: 20,
            y: 20
          }
        ],
        health: [],
        ammo: [],
      };

      const updatedState = maybeUpdatePlayerTargets(state);

      expect(updatedState.players[0].target.x).toBe(20);
      expect(updatedState.players[0].target.y).toBe(20);
    });

    it('updates target to health when health is low', () => {
      const state = {
        graph: new Graph(new Array(30).fill(0).map(() => new Array(30).fill(1))),
        players: [
          {
            ...player1,
            enemy: 1,
            health: 30,
            target: {
              type: 'enemy',
              x: 10,
              y: 10
            }
          },
          {
            enemy: 0,
            ...player2,
            x: 20,
            y: 20
          }
        ],
        health: [{x: 10, y: 10, health: 20}],
        ammo: [],
      };

      const updatedState = maybeUpdatePlayerTargets(state);

      expect(updatedState.players[0].target).toEqual({type: 'health', x: 10, y: 10, health: 20})
    });

    it('updates target to ammo when ammo is low', () => {
      const state = {
        graph: new Graph(new Array(30).fill(0).map(() => new Array(30).fill(1))),
        players: [
          {
            ...player1,
            enemy: 1,
            ammo: 0,
            target: {
              type: 'enemy',
              x: 10,
              y: 10
            }
          },
          {
            enemy: 0,
            ...player2,
            x: 20,
            y: 20
          }
        ],
        health: [],
        ammo: [{x: 10, y: 10, ammo: 20}],
      };

      const updatedState = maybeUpdatePlayerTargets(state);

      expect(updatedState.players[0].target).toEqual({type: 'ammo', x: 10, y: 10, ammo: 20})
    });

    it('updates target to fighting when enemy is close enough', () => {

    });

    it('randomly selects a new target when enemy dies');
    it('randomly moves inside room while fighting');
  })
});
