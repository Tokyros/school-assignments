
class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }
}



function update(state) {
    // calculate next move for each player:
    // 1. Maybe change target (if health drops, if ammo drops)
    // 2. Calculate path to target
    // 3. if target is another player
        // 1. if same room, shoot at target
        // 2. else take one step
    // 4. check intersection
}