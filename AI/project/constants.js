import { createPlayer } from './builders.js';

const dimensions = {
  canvasWidth: 1100,
  canvasHeight: 1100,
  POINT_SIZE: 15,
};

const WALL = 0;
const FLOOR = 1;

const ROOMS = [
  { x1: 1, y1: 532, x2: 250, y2: 750 },
  { x1: 20, y1: 300, x2: 257, y2: 510 },
  { x1: 202, y1: 80, x2: 431, y2: 250 },
  { x1: 500, y1: 200, x2: 720, y2: 470 },
  { x1: 510, y1: 500, x2: 768, y2: 759 },
  { x1: 896, y1: 440, x2: 1052, y2: 646 },
  { x1: 850, y1: 3, x2: 1085, y2: 300 },
];

const PASSAGES = window.passages;

const OBSTACLES = window.obstacles;

const BALANCED_PLAYER = {
    minHealth: 50,
    minAmmo: 3,
}

const RISKY_PLAYER = {
    minHealth: 20,
    minAmmo: 5,
}

const SCARED_PLAYER = {
    minHealth: 70,
    minAmmo: 1,
}

const DAREDEVIL = {
    minHealth: 10,
    minAmmo: 1,
}



const player1 = createPlayer("Player 1", 1, 2, BALANCED_PLAYER, {
    x: ROOMS[2].x1 + 0,
    y: ROOMS[2].y1 + 40,
  }
);

const player2 = createPlayer("Player 2", 1, 3, RISKY_PLAYER, {
    x: ROOMS[1].x1 + 60,
    y: ROOMS[1].y1 + 80,
  }
);

const player3 = createPlayer("Player 3", 2, 0, SCARED_PLAYER, {
    x: ROOMS[3].x1 + 70,
    y: ROOMS[3].y1 + 70,
  }
);

const player4 = createPlayer("Player 4", 2, 1, DAREDEVIL, {
    x: ROOMS[6].x1 + 10,
    y: ROOMS[6].y1 + 10,
  }
);

const PLAYERS = [player1, player2, player3, player4];

export { dimensions, WALL, FLOOR, ROOMS, PASSAGES, OBSTACLES, PLAYERS };
