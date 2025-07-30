import { getBetOptionResult, updateActivePlayer, updateFoldedPlayer } from "./table/table.js";
import { Game } from "./utils.js";

/** * @param {Game} game */
const saveTree = async (game) => {
    const savedPlayers = JSON.stringify(game.players)
    const savedStates = []

    game.betSmallBlind()
    game.betBigBlind()
    
    // Show initial active player
    updateActivePlayer(game)
    
    for (let i = 0; i < 4; i++) {
        while (game.lastBetIndex != game.currentPlayerIndex) {
            const currentPlayer = game.players[game.currentPlayerIndex]
            const betOption = await getBetOptionResult(game)
            
            if (betOption == "fold") {
                game.fold(currentPlayer)
                updateFoldedPlayer(currentPlayer)
            }
            else if (betOption == "call") {
                game.bet(currentPlayer, game.lastBet)
            }
            else if (betOption == "all in") {
                game.lastBetIndex = game.currentPlayerIndex
                const allInAmount = currentPlayer.stack + currentPlayer.currentBet
                game.bet(currentPlayer, allInAmount)
            }
            else if (betOption[1] == "x") {
                game.lastBetIndex = game.currentPlayerIndex
                game.bet(currentPlayer, (betOption[0] - "0") * game.lastBet)
            }
            
            game.setIndexNextPlayer()
            savedStates.push(betOption)
            updateActivePlayer(game)
        }
        if (!game.isPostflopInclude) break
        if (i == 0) {}
        if (i == 1) {}
        if (i == 2) {}
    }
    downloadGame(savedPlayers, savedStates)
}; 



const downloadGame = (savedPlayers, savedStates) => {
    const gameData = {
        players: JSON.parse(savedPlayers),
        states: savedStates,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `poker_game_${Date.now()}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(link.href);
}


export { saveTree };