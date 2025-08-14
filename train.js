import { displayCardsAtCenter, getBetOptionResult, updateActivePlayer, updateFoldedPlayer, clearBetAnimations, showWrongBetIndication } from "./table/table.js";
import { Game } from "./utils.js";

/** * @param {Game} game @param {string[]} actions */
const trainGame = async (game, actions, wrongMoves, totalMoves) => {
    game.betSmallBlind()
    game.betBigBlind()
    updateActivePlayer(game)
    let actionIndex = 0
    
    // Create wrong move counter display
    const wrongCounterDisplay = document.createElement('div');
    wrongCounterDisplay.className = 'wrong-move-counter';
    wrongCounterDisplay.textContent = `Wrong Moves: ${wrongMoves.data}`;
    document.body.appendChild(wrongCounterDisplay);

    // Create total move counter display
    const totalCounterDisplay = document.createElement('div');
    totalCounterDisplay.className = 'total-move-counter';
    totalCounterDisplay.textContent = `Total Moves: ${totalMoves.data}`;
    document.body.appendChild(totalCounterDisplay);

    for (let i = 0; i < 4; i++) {
        let counter = 0
        while (game.lastBetIndex != game.currentPlayerIndex && !game.isEveryOneFold() && counter != game.getActivePlayerCount() && !game.isEveryOneAllIn()) {
            const currentPlayer = game.players[game.currentPlayerIndex]
            let betOption = ""
            if (currentPlayer.isRealPlayer) {
                betOption = await getBetOptionResult(game)
                totalMoves.data++;
                totalCounterDisplay.textContent = `Total Moves: ${totalMoves.data}`;
                while (betOption != actions[actionIndex]){
                    wrongMoves.data++;
                    wrongCounterDisplay.textContent = `Wrong Moves: ${wrongMoves.data}`;
                    showWrongBetIndication()
                    betOption = await getBetOptionResult(game)
                    totalMoves.data++;
                    totalCounterDisplay.textContent = `Total Moves: ${totalMoves.data}`;
                }
            }
            else betOption = actions[actionIndex]
            actionIndex++
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
            else if (betOption.includes("x")) {
                game.lastBetIndex = game.currentPlayerIndex
                const multiplier = parseInt(betOption.replace("x", ""))
                game.bet(currentPlayer, multiplier * game.lastBet)
            }

            if (!currentPlayer.isRealPlayer) {
                await new Promise((resolve) => setTimeout(resolve, betOption != "fold" ? 800 : 100))
            }
            game.setIndexNextPlayer()
            updateActivePlayer(game)
        }
        
        clearBetAnimations()
        if (i == 0) {
            if (game.flop.length > 0) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2]])
            else break
        }
        if (i == 1) {
            if (game.turn.length > 0) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2], game.turn[0]])
            else break
        }
        if (i == 2) {
            if (game.river.length > 0) displayCardsAtCenter([game.flop[0], game.flop[1], game.flop[2], game.turn[0], game.river[0]])
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