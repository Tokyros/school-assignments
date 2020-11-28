# AI Project - 
Shahar Rosen - 204541791
Dor Ben Baruch - 307881268

Final project for Afeka AI course, an AI powered dungeon game with the following behavior
- Four players, two on each team
- Each player has different characteristics that affect when he runs to replenish health and ammo
- There are multiple rooms with paths between them
- Players search for each other to fight
- When a player is low on health or ammo he searches for them
- Players shoot bullets for long range battle and grenades for short range battle
- Game ends when on of the teams is dead

## How to run
Two options:
1. run `npm install` inside the project directory
2. run `npm start` inside the project directory
3. in any web-browser navigate to `localhost:8000`

## State explanation
Inside `state.js` file we handle all the logic related to updating the game's state.
The file exposes a single `update` function that receives a `state` object and returns an updated `state` objects. The main loop of the game calls this `update` function and then passes the result to the function that draws the map and all its components.

A single state update does the following:
1. `maybeUpdatePlayerTargets` - if needed, changes the player target, this can happen when -
1.1. Player is low on health (according to his characteristics)
1.2. Player is low on ammo  (according to his characteristics)
1.3. Player's target is dead
1.4. Players in fighting mode search for location in the room to run to while fighting
2. `movePlayers` - Updates player's position according to target's location
2.1. Every few frames the `astar` algorithm is executed to calculate the path to the target
2.2. Every frame the next step in the path is executed and the player's location is updated
3. `maybeTakeHealth` - checks if a user is standing on a health token and consumes it
4. `maybeTakeHealth` - checks if a user is standing on a ammo token and consumes it
5. `maybeHitPlayers` - checks if a bullet hits one of the players and reduces his health accordingly
6. `maybeKillPlayers` - checks if the user's health is replenished and marks him as dead if it is
7. `maybeShootBullets` - checks if the players are in a situation to shoot, it then adds bullets/grenades accordingly
8. `updateBulletsPositions` - moves bullets according to their trajectory
9. `explodeGrenades` - when grenades damage runs out, it means it's time for them to explode, which then creates 6 bullets that fly in different directions from the last position of the grenade
10. `removeOutOfBoundsBullets` - takes care of bullets/grenades that are out of bound, meaning if they hit an obstacle or a wall
10.1. for bullets they simply disappear
10.2. for grenades they bounce back from the wall/obstacle
11. `updatePlayersCooldowns` - each player has a cooldown preventing him from shooting all his ammo at once, this function updates that cooldown
12. `maybeSpawnAmmo` - when there are not many ammo tokens left, we spawn more of them, so that players don't run out of ammo and are left with nothing to do

## File structure
- main.js - Initializes the initial state of the game + manages the game loop
- constants.js - contains all constant values in the project, such as players, rooms, passages etc
- builders.js - Contains helpers to create the different game objects, such as players, bullets, etc
- obstacles.js - A file containing a constant obstacles array
- passages.js - A file containing a constant passages array
- canvas.js - Handles all logic relevant to drawing the map, bullets, characters and information
- graph.js - Contains a function to generate the map's graph that contains all the rooms, passages, and obstacles on the map
- geometry.js - Contains utility functions for handling with geometry, such as checking if a point is contained in a room etc
- security-map.js - Contains logic to generate the security map that allows characters to prefer safe locations when choosing where to go to
- state.js - Stores all logic for updating the state of the game, such as moving players around, shooting bullets, calculating paths, etc
- astar.js - Contains the implementation of the astar algorithm, as well as the definition for the graph that it requires to operate on

