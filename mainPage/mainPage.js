import getHands from "../questions/getHands.js";
import getPosition from "../questions/getPosition.js";
import getPros from "../questions/getPros.js";
import getStack from "../questions/getStack.js";
import getTreeType from "../questions/getTreeType.js";
import { Game } from "../utils.js";
import { saveTree } from "../saveTree.js";
import {displayBet, displayPlayers, displayTable, getBetOptionResult } from "../table/table.js";
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
        
        // Get all game settings
        await getTreeType(game);

        if (game.isPostflopInclude) await getFlopTurnRiver(game)

        await getStack(game);
        await getPosition(game);
        await getHands(game);
        await getPros(game);
        
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

const trainTreeButton = () => {
    
}


export {displayMainPage}