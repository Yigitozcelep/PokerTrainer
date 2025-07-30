import showPositions from './showPositions.js';
const getPros = async (game) => {
    
    const selectedPositions = await showPositions(game, (positions) => {
        positions.forEach(position => {
            const player = game.players.find(p => p.position === position);
            if (player) {
                player.isPro = true;
            }
        });
    }, true);
    
    return selectedPositions;
}

export default getPros;