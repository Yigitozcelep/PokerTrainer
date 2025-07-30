import { getBetOptionResult } from "./table/table.js";
import { Game } from "./utils.js";

/** * @param {Game} game */
const saveTree = async (game) => {
    const savedStates = [JSON.stringify(game)]

    game.betSmallBlind()
    game.betBigBlind()
    while (game.lastBetIndex != game.currentPlayerIndex) {
        const currentPlayer = game.players[game.currentPlayerIndex]
        const betOption = await getBetOptionResult(game)
        if (betOption == "fold") game.fold(currentPlayer)
        if (betOption == "call") game.bet(currentPlayer, game.lastBet)
        if (betOption[1] == "x") {
            game.lastBetIndex = game.currentPlayerIndex
            game.bet(currentPlayer, (betOption[0] - "0") * game.lastBet)
        }
        game.setIndexNextPlayer()
    }
};  


export { saveTree };