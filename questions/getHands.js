
import selectCards from './selectCards.js';

const getHands = async (game) => {
    const selectedCards = await selectCards('Select Your Hand (2 cards)', 2);
    
    const realPlayer = game.players.find(p => p.isRealPlayer);
    if (realPlayer) {
        realPlayer.hand = selectedCards.join(' ');
    }
    
    return selectedCards;
}

export default getHands;