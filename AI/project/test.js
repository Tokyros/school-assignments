import { expect, it } from '@jest/globals';
import astar, { Graph } from './astar';
import { update } from './state';

// state:
/* 
{
    players: [player, player, player, player],
    ammo: [...ammo],
    health: [...ammo],
    bullets: [...bullets]
}
*/

const defaultState = {
    graph: new Graph([]),
    players: [],
    rooms: [],
    health: [],
    ammo: []
}

describe('game state', () => {
    it('moves players towards target', () => {
        const state = {
            ...defaultState,
            graph: new Graph([[1, 1], [1, 1]]),
            players: [{
                x: 0,
                y: 0,
                target: {x: 1, y: 0}
            }, {
                x: 1,
                y: 1,
                target: {x: 0, y: 0}
            }],
        }
        const expectedState = {
            ...state,
            players: [{
                x: 1,
                y: 0,
                target: {x: 1, y: 0}
            }, {
                x: 0,
                y: 1,
                target: {x: 0, y: 0}
            }]
        }

        expect(update(state)).toEqual(expectedState);
    });

    it('takes health', () => {
        const state = {
            ...defaultState,
            graph: new Graph([[1, 1], [1, 1]]),
            players: [{
                x: 0,
                y: 0,
                target: {x: 0, y: 0},
                health: 50
            }],
            health: [
                {
                    x: 0,
                    y: 0,
                    health: 50
                }
            ]
        }

        const newState = update(state);

        expect(newState.players[0].health).toBe(100);
        expect(newState.health.length).toBe(0);
    });

    it('takes ammo', () => {
        const state = {
            ...defaultState,
            graph: new Graph([[1, 1], [1, 1]]),
            players: [{
                x: 0,
                y: 0,
                target: {x: 0, y: 0},
                health: 50,
                ammo: 50
            }],
            ammo: [{
                x: 0,
                y: 0,
                ammo: 50
            }]
        }

        const newState = update(state);

        expect(newState.players[0].ammo).toBe(100);
    });

    it('takes a long walk', () => {
        const state = {
            graph: new Graph(new Array(55).fill(0).map(() => new Array(55).fill(1))),
            players: [{
                x: 0,
                y: 0,
                target: {x: 50, y: 50}
            }],
            health: [],
            ammo: []
        }

        let newState = state;
        for (let i = 0; i < 100; i++) {
            newState = update(newState);
        }

        expect(newState.players[0].x).toEqual(50);
        expect(newState.players[0].y).toEqual(50);
    });
});
