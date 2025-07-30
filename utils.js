

const positions = ["BTN", "SB", "BB", "EP", "MP", "CO"]

class Player {
    constructor(position) {
        this.isRealPlayer = false
        this.position = position
        this.isPro = false
        this.hand = ""
        this.stack = 0
    }
}

class Game {
    constructor() {
        this.players = positions.map(el => new Player(el))
        this.isPostflopInclude = false
    }
}

export { Player, Game, positions };