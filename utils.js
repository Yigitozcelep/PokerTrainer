

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
    }

    adjustTableCoors() {
        let playerIndex = this.players.findIndex(el => el.isRealPlayer)
        const length = this.players.length
        for (let i = 0; i < length; i++) this.players[(playerIndex + i) % length].tableCoors = positionDatas[i]
        console.log(this.players)
    }

    bet(player, amount) {
        player.stack -= amount;
        this.totalMoneyInTheMiddle += amount;
        this.lastBet = amount;
        player.currentBet += amount;
        return true;
    }
}

export { Player, Game };