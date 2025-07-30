import getHands from "../questions/getHands.js";
import getPosition from "../questions/getPosition.js";
import getPros from "../questions/getPros.js";
import getStack from "../questions/getStack.js";
import getTreeType from "../questions/getTreeType.js";
import getDescription from "../questions/getDescription.js";
import { Game } from "../utils.js";
import { saveTree } from "../saveTree.js";
import {displayBet, displayCardsAtCenter, displayPlayers, displayTable, getBetOptionResult } from "../table/table.js";
import getFlopTurnRiver from "../questions/getFlopTurnRiver.js";

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
        const game = new Game();
        
        await getStack(game);
        await getPosition(game);
        await getPros(game);
        const userHand = await getHands(game);
        await getFlopTurnRiver(game, userHand);
        await getDescription(game);
        game.adjustTableCoors()
        const table = displayTable(game)
        await saveTree(game);
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
                            console.error(`Error reading file ${file.name}:`, error);
                        }
                    }
                }
                
                console.log(`Found ${jsonFiles.length} JSON files`);
                console.log(jsonFiles)
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


const trainTreeButton = async () => {
    const data = await getFiles()[0]
    const game = new Game()
    console.log("data: ", data)
    game.players = data.players
    game.description = data.description
    game.flop = data.flop
    game.turn = data.turn
    game.river = data.river
    const actions = data.states
    game.adjustTableCoors()
    const table = displayTable(game)
    
    trainGame(game, actions)
}


export {displayMainPage}