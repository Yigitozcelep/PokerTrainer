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

    downloadGame(savedPlayers, savedStates)
}; 



const downloadGame = (savedPlayers, savedStates) => {
    // downlaod the data in .json file
}


export { saveTree };