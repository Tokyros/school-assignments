// Types
export const WALL = 0;
export const FLOOR = 1;
export const PLAYER = 2;
export const HEALTH = 3;
export const AMMO = 4;

class Node {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}