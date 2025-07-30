import { displayCardsAtCenter, getBetOptionResult, updateActivePlayer, updateFoldedPlayer, clearBetAnimations } from "./table/table.js";
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
        while (game.lastBetIndex != game.currentPlayerIndex && !game.isEveryOneFold()) {
            const currentPlayer = game.players[game.currentPlayerIndex]
            const betOption = await getBetOptionResult(game)
            
            if (betOption == "fold") {
                game.fold(currentPlayer)
                updateFoldedPlayer(currentPlayer)
            }
            else if (betOption == "call") {
                game.bet(currentPlayer, game.lastBet)
            }
            else if (betOption == "check") {
                // No action needed for check
            }
            else if (betOption == "all in") {
                game.lastBetIndex = game.currentPlayerIndex
                const allInAmount = currentPlayer.stack + currentPlayer.currentBet
                game.bet(currentPlayer, allInAmount)
            }
            else if (betOption.includes("%")) {
                game.lastBetIndex = game.currentPlayerIndex
                const percentage = parseInt(betOption) / 100
                const betAmount = Math.floor(game.totalMoneyInTheMiddle * percentage)
                game.bet(currentPlayer, betAmount)
            }
            else if (betOption[1] == "x") {
                game.lastBetIndex = game.currentPlayerIndex
                game.bet(currentPlayer, (betOption[0] - "0") * game.lastBet)
            }
            
            game.setIndexNextPlayer()
            savedStates.push(betOption)
            updateActivePlayer(game)
        }
        
        clearBetAnimations()
        if (i == 0) {
            if (game.flop) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2]])
            else break
        }
        if (i == 1) {
            if (game.turn) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2], game.turn[0]])
            else break
        }
        if (i == 2) {
            if (game.river) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2], game.turn[0], game.river[0]])
            else break
        }
        game.lastBetIndex = -1
        game.setFirstPlayer()
        game.players.forEach(el => el.currentBet = 0)
        updateActivePlayer(game)
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