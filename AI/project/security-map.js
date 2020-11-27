import { createBullet } from './builders.js';
import { dimensions } from './constants.js';
import { update } from './state.js';

// Generates a security map by simulating the shooting of multiple bullets
// From different spots in each room
// Every tile gains "danger points" when a bullet crosses it
export function generateSecurityMap(graph, rooms, passages, obstacles) {
    const bulletsToCover = rooms.reduce((bullets, room) => {
      const grenades = [
        {x: Math.floor((room.x1 + room.x2) / 2), y: Math.floor((room.y1 + room.y2) / 2)},
        {x: room.x1 + 10, y: room.y1 + 10},
        {x: room.x1 + 10, y: room.y2 - 10},
        {x: room.x2 - 10, y: room.y1 + 10},
        {x: room.x2 - 10, y: room.y2 - 10},
      ]
  
      const newBullets = grenades.reduce((bulletsFromGrenades, grenade) => {
        let bulletsFromSingleGrenade = [];
        for (let angle = 0; angle < 360; angle += 1) {
          const theta = angle * (Math.PI / 180)
          const dx = Math.cos(theta) * 500;
          const dy = Math.sin(theta) * 500;
          const target = {x: grenade.x + dx, y: grenade.y + dy};
          bulletsFromSingleGrenade.push(createBullet(grenade, target, 0));
        }
        return [...bulletsFromGrenades, ...bulletsFromSingleGrenade]
      }, []);
      
      return [
        ...bullets,
        ...newBullets
      ]
    }, []);
  
    let securitySimulationState = {
      graph,
      rooms,
      passages,
      obstacles,
      bullets: bulletsToCover,
      players: [],
      health: [],
      ammo: [],
    }
  
    const securityMap = new Array(dimensions.canvasWidth).fill(0).map((_) =>
      new Array(dimensions.canvasHeight).fill(0).map((_) => {
          return 0;
      })
    );
  
    do {
      securitySimulationState = update(securitySimulationState);
      securitySimulationState.bullets.forEach((bullet) => {
        securityMap[Math.floor(bullet.x)][Math.floor(bullet.y)] += 1;
      })
    } while (securitySimulationState.bullets.length)
    return securityMap;
  }