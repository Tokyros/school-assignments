export function createPlayer(name, team, enemyIdx, character, startingPoint) {
	return {
		name,
		team,
		...startingPoint,
		health: 100,
		enemy: enemyIdx,
		ammo: 9,
		character,
		entirePath: [],
		path: [],
		cooldown: 0,
	};
}

export function createBullet(from, to, playerIdx) {
	const targetY = to.y + 5;
	const targetX = to.x + 5;
	const bulletX = from.x + 5;
	const bulletY = from.y + 5;

	const dx = targetX - bulletX;
	const dy = targetY - bulletY;
	const angle = Math.atan2(dy, dx);

	const directionX = Math.cos(angle);
	const directionY = Math.sin(angle);

	return {
		from: playerIdx,
		type: 'bullet',
		x: bulletX,
		y: bulletY,
		damage: 10,
		direction: {
			x: directionX,
			y: directionY
		}
	}
}

export function createGrenade(from, to, playerIdx) {
	return {
		...createBullet(from, to, playerIdx),
		type: "grenade",
		// Grenade explodes when damage reaches 0
		damage: 3,
	}
  }
  