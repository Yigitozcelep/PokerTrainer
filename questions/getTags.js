import showPositions from './showPositions.js';
const getTags = async (game, tag) => {
    
    const selectedPositions = await showPositions(game, (positions) => {
        positions.forEach(position => {
            const player = game.players.find(p => p.position === position);
            if (player) {
                player.tag = tag;
            }
        });
    }, tag, true, true);
    
    return selectedPositions;
}

export default getTags;