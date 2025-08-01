import showPositions from './showPositions.js';

const getPosition = async (game) => {
    const selectedPosition = await showPositions(game, (position) => {
        const player = game.players.find(p => p.position === position);
        
        if (player) {
            player.isRealPlayer = true;
        }
    }, "Select Your Position");
    
    return selectedPosition;
}

export default getPosition;