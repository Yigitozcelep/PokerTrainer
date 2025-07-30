import { displayCardsAtCenter, getBetOptionResult, updateActivePlayer, updateFoldedPlayer, clearBetAnimations } from "./table/table.js";
import { Game } from "./utils.js";

/** * @param {Game} game @param {string[]} actions */
const trainGame = async (game, actions) => {
    game.betSmallBlind()
    game.betBigBlind()
    updateActivePlayer(game)
    let actionIndex = 0

    for (let i = 0; i < 4; i++) {
        let counter = 0
        while (game.lastBetIndex != game.currentPlayerIndex && !game.isEveryOneFold() && counter != game.getActivePlayerCount() && !game.isEveryOneAllIn()) {
            const currentPlayer = game.players[game.currentPlayerIndex]
            let betOption = ""
            if (currentPlayer.isRealPlayer) {
                betOption = await getBetOptionResult(game)
                while (betOption != actions[actionIndex]){
                    alert("Wrong Bet Option")
                    betOption = await getBetOptionResult(game)
                }
            }
            else betOption = actions[actionIndex]
            actionIndex++
            console.log("bet option: ", betOption)
            if (betOption == "fold") {
                game.fold(currentPlayer)
                updateFoldedPlayer(currentPlayer)
            }
            else if (betOption == "call") {
                game.bet(currentPlayer, game.lastBet)
            }
            else if (betOption == "check") {
                counter++
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

            if (!currentPlayer.isRealPlayer) await new Promise((resolve) => setTimeout(resolve, 800))
            game.setIndexNextPlayer()
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
        game.lastBet = 0
        game.setFirstPlayer()
        game.players.forEach(el => el.currentBet = 0)
        updateActivePlayer(game)
    }
}; 

export {trainGame}