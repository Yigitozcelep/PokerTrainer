import getHands from "../questions/getHands.js";
import getPosition from "../questions/getPosition.js";
import getPros from "../questions/getTags.js";
import getStack from "../questions/getStack.js";
import getTreeType from "../questions/getTreeType.js";
import getDescription from "../questions/getDescription.js";
import { Game, Player } from "../utils.js";
import { saveTree } from "../saveTree.js";
import {displayBet, displayCardsAtCenter, displayPlayers, displayTable, getBetOptionResult } from "../table/table.js";
import getFlopTurnRiver from "../questions/getFlopTurnRiver.js";
import { trainGame } from "../train.js";
import { customConfirm } from "../components/customConfirm.js";
import { showGameCompleteDialog } from "../components/gameCompleteDialog.js";
import getTags from "../questions/getTags.js";

const displayMainPage = () => {
    const body = document.body;
    body.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'main-container';
    
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'Poker Range Trainer';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    
    const saveButton = document.createElement('button');
    saveButton.className = 'main-button save-button';
    saveButton.textContent = 'Save Tree';
    saveButton.onclick = saveTreeButton;
    
    const trainButton = document.createElement('button');
    trainButton.className = 'main-button train-button';
    trainButton.textContent = 'Train Tree';
    trainButton.onclick = trainTreeButton;
    
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(trainButton);
    
    container.appendChild(title);
    container.appendChild(buttonsContainer);
    
    body.appendChild(container);
}

const saveTreeButton = async() => {
    // Hide main page content
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    try {
        let game = new Game();
        
        await getStack(game);
        await getPosition(game);
        await getTags(game, "Pro");
        await getTags(game, "Aggro");
        await getTags(game, "Passive");
        await getTags(game, "Fish");
        const userHand = await getHands(game);
        await getFlopTurnRiver(game, userHand);
        await getDescription(game);
        game.adjustTableCoors()
        const table = displayTable(game)

        const datas = []
        for (let i = 0; i < 1000; i++) datas.push(game.copyGame())
        game = datas.pop()
        while ((await saveTree(game)) === "undo") {
            game = datas.pop()
            mainContainer.style.display = '';
            displayTable(game)
    }
        
    } catch (error) {
        console.error('Error during tree setup:', error);
        alert('Error saving tree. Please try again.');
    } finally {
        // Restore main page
        if (mainContainer) {
            mainContainer.style.display = '';
        }
    }
}

const getFiles = async () => {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.directory = true;
        input.multiple = true;
        
        return new Promise((resolve) => {
            input.addEventListener('change', async (event) => {
                const files = event.target.files;
                const jsonFiles = [];
                
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.name.endsWith('.json')) {
                        try {
                            const text = await file.text();
                            const data = JSON.parse(text);
                            jsonFiles.push({
                                name: file.name,
                                path: file.webkitRelativePath,
                                data: data
                            });
                        } catch (error) {
                            console.error(`Error reading file ${file.name} path: ${file.webkitRelativePath}`, error);
                        }
                    }
                }
                
                resolve(jsonFiles);
            });
            
            input.click();
        });
    } catch (error) {
        console.error('Error selecting folder:', error);
        alert('Error selecting folder. Please try again.');
        return [];
    }
}

class WrongMove {
    constructor() {
        this.data = 0
    }
}

class TotalMove {
    constructor() {
        this.data = 0
    }
}


const trainTreeButton = async () => {
    const files = await getFiles()
    if (!files || files.length === 0) {
        alert('No files selected. Please select a folder with JSON files.')
        return
    }
    

    const wrongMoves = new WrongMove()
    const totalMoves = new TotalMove()
    while (true) {
        const randomIndex = Math.floor(Math.random() * files.length)
        const file = files[randomIndex]
        const data = file.data
        const game = new Game()
        game.players = data.players.map(el => new Player(el.position, el.tableCoors))
        game.players.forEach((el, i) => {
            el.currentBet = data.players[i].currentBet
            el.hand = data.players[i].hand
            el.isFold = data.players[i].isFold
            el.tag = data.players[i].tag
            el.isRealPlayer = data.players[i].isRealPlayer
            el.stack = data.players[i].stack
        })
        game.description = data.description
        game.flop = data.flop
        game.turn = data.turn
        game.river = data.river
        const actions = data.states
        game.adjustTableCoors()
        const table = displayTable(game)

        await trainGame(game, actions, wrongMoves, totalMoves)

        const dialogResult = await showGameCompleteDialog(game.description, file.name, file.path)
        if (dialogResult === 'quit') {
            break
        }
    }
    
    displayMainPage()
}


export {displayMainPage}