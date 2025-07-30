import { displayBet, updatePlayerStack } from "./table/table.js"


class TableCoors {
    constructor(offsetX, offsetY) {
        this.offsetX = offsetX
        this.offsetY = offsetY
    }
}

class Player {
    constructor(position, tableCoors) {
        this.tableCoors = tableCoors
        this.isRealPlayer = false
        this.position = position
        this.isPro = false
        this.hand = ""
        this.stack = 0
        this.currentBet = 0
        this.isFold = false
    }
}

const positionDatas = [
    new TableCoors(-20, 190),      // Bottom center (player's position)
    new TableCoors(-300, 160),   // Bottom left
    new TableCoors(-300, -160),  // Top left
    new TableCoors(-20, -190),     // Top center
    new TableCoors(260, -160),   // Top right
    new TableCoors(240, 160),    // Bottom right
]

const positions = ['BTN','SB','BB','EP','MP','CO']

class Game {
    constructor() {
        this.players = positions.map(el => new Player(el, new TableCoors(0, 0)))
        this.isPostflopInclude = false
        this.totalMoneyInTheMiddle = 0
        this.lastBet = 0

        this.lastBetIndex = this.getBigBlindIndex()
        this.currentPlayerIndex = this.getEpIndex()
        console.log("initial: ", this.lastBetIndex, this.currentPlayerIndex)

        this.flop = []
        this.turn = []
        this.river = []
    }

    isEveryOneFold() {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].isFold) return false;
        }
        return true
    }
    
    setFirstPlayer() {
        for (let i = 1; i < this.players.length + 1; i++) {
            let j = i % this.players.length
            if (this.players[j].isFold) continue
            this.currentPlayerIndex = j
            return
        }
    }

    adjustTableCoors() {
        let playerIndex = this.players.findIndex(el => el.isRealPlayer)
        const length = this.players.length
        for (let i = 0; i < length; i++) this.players[(playerIndex + i) % length].tableCoors = positionDatas[i]
        console.log(this.players)
    }

    fold(player) {
        player.isFold = true
    }

    bet(player, amount) {
        const dif = amount - player.currentBet
        player.stack -= dif;
        this.totalMoneyInTheMiddle += dif;
        this.lastBet = amount;
        player.currentBet = amount;
        displayBet(player, player.currentBet, this)
        updatePlayerStack(player);
        return true;
    }

    setIndexNextPlayer() {
        for (let i = 1; i < this.players.length; i++) {
            const j = (i + this.currentPlayerIndex) % this.players.length
            if (this.players[j].isFold) continue
            this.currentPlayerIndex = j
            return
        }
        throw Error("impossible player index")
    }

    getSmallBlindIndex() {
        return this.players.findIndex(el => el.position == "SB")
    }

    getBigBlindIndex() {
        return this.players.findIndex(el => el.position == "BB")
    }
    
    betSmallBlind() {
        const sb = this.players[this.getSmallBlindIndex()]
        this.bet(sb, 1)
    }
    
    betBigBlind() {
        const bb = this.players[this.getBigBlindIndex()]
        this.bet(bb, 2)
    }

    getEpIndex() {
        return this.players.findIndex(el => el.position == "EP")
    }
}


const getAvaliableBetOptions = (game) => {
    const currentPlayer = game.players[game.currentPlayerIndex];
    const options = ["fold", "call"];
    const amountToCall = game.lastBet - currentPlayer.currentBet;
    const raiseBase = game.lastBet;

    if (currentPlayer.stack >= amountToCall + (2 * raiseBase)) {
        options.push("2x");
    }
    
    if (currentPlayer.stack >= amountToCall + (3 * raiseBase)) {
        options.push("3x");
    }
    
    if (currentPlayer.stack >= amountToCall + (4 * raiseBase)) {
        options.push("4x");
    }
    
    if (currentPlayer.stack > amountToCall && currentPlayer.stack > 0) {
        options.push("all in");
    }
    
    return options;
}

export { Player, Game, getAvaliableBetOptions};