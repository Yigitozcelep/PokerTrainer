
const displayTable = (game) => {
    // Clear the body and create table container
    document.body.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'table-container';
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Back to Menu';
    backButton.addEventListener('click', () => {
        // Reload the page to go back to main menu
        window.location.reload();
    });
    container.appendChild(backButton);
    
    // Create the poker table
    const pokerTable = document.createElement('div');
    pokerTable.className = 'poker-table';
    
    // Create table center (for pot and community cards)
    const tableCenter = document.createElement('div');
    tableCenter.className = 'table-center';
    
    const potSize = document.createElement('div');
    potSize.className = 'pot-size';
    potSize.textContent = 'Pot: $0';
    
    const communityCards = document.createElement('div');
    communityCards.className = 'community-cards';
    communityCards.id = 'community-cards';
    
    tableCenter.appendChild(potSize);
    tableCenter.appendChild(communityCards);
    pokerTable.appendChild(tableCenter);
    
    // Display players
    displayPlayers(game, pokerTable);
    
    container.appendChild(pokerTable);
    document.body.appendChild(container);
    
    return container;
}

const displayPlayers = (game, tableElement) => {
    // Display players in their positions
    game.players.forEach((player, index) => {
        const playerSeat = document.createElement('div');
        playerSeat.className = `player-seat ${player.position}`;
        
        // Add real player highlight
        if (player.isRealPlayer) {
            playerSeat.classList.add('real-player');
        }
        
        // Position label
        const positionLabel = document.createElement('div');
        positionLabel.className = 'player-position';
        positionLabel.textContent = player.position;
        playerSeat.appendChild(positionLabel);
        
        // Player type (Pro label if applicable)
        if (player.isPro) {
            const proLabel = document.createElement('div');
            proLabel.className = 'player-type';
            proLabel.textContent = 'PRO';
            playerSeat.appendChild(proLabel);
        }
        
        // Stack size
        const stackDisplay = document.createElement('div');
        stackDisplay.className = 'player-stack';
        stackDisplay.textContent = `$${player.stack}`;
        playerSeat.appendChild(stackDisplay);
        
        // Player cards (only show for real player)
        if (player.isRealPlayer && player.hand) {
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'player-cards';
            
            // Split hand into individual cards
            const cards = player.hand.split(' ');
            cards.forEach(card => {
                const cardElement = createCardElement(card, 'player-card');
                cardsContainer.appendChild(cardElement);
            });
            
            playerSeat.appendChild(cardsContainer);
        }
        
        tableElement.appendChild(playerSeat);
    });
}

const createCardElement = (cardString, className = 'card') => {
    const cardElement = document.createElement('div');
    cardElement.className = className;
    
    // Determine if card is red or black based on suit
    if (cardString.includes('♥') || cardString.includes('♦')) {
        cardElement.classList.add('red');
    } else {
        cardElement.classList.add('black');
    }
    
    cardElement.textContent = cardString;
    return cardElement;
}

const showCommunityCards = (cards) => {
    const communityCardsContainer = document.getElementById('community-cards');
    communityCardsContainer.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        communityCardsContainer.appendChild(cardElement);
    });
}

const showActionButtons = (actions) => {
    // Remove existing action buttons
    const existingButtons = document.querySelector('.action-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }
    
    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.className = 'action-buttons';
    
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = `action-button ${action.toLowerCase()}`;
        button.textContent = action;
        button.addEventListener('click', () => {
            console.log(`Player action: ${action}`);
            // Handle action here
        });
        actionButtonsContainer.appendChild(button);
    });
    
    document.querySelector('.table-container').appendChild(actionButtonsContainer);
}

export { displayTable, displayPlayers, showCommunityCards, showActionButtons };