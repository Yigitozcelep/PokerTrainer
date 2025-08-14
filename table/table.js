import { getAvaliableBetOptions } from "../utils.js";

const displayTable = (game) => {
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
    // Table dimensions are fixed in CSS: 700px x 350px
    const tableWidth = 700;
    const tableHeight = 350;
    const centerX = tableWidth / 2;
    const centerY = tableHeight / 2;
    
    game.players.forEach((player, index) => {
        const playerSeat = document.createElement('div');
        // Use position name for CSS class identification
        playerSeat.className = `player-seat`;
        playerSeat.setAttribute('data-position', player.position);
        
        // Use the player's table coordinates
        playerSeat.style.position = 'absolute';
        playerSeat.style.left = `${centerX + player.tableCoors.offsetX}px`;
        playerSeat.style.top = `${centerY + player.tableCoors.offsetY}px`;
        playerSeat.style.transform = 'translate(-50%, -50%)';
        
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
        if (player.tag.length > 0) {
            const proLabel = document.createElement('div');
            proLabel.className = 'player-type';
            proLabel.textContent = player.tag;
            playerSeat.appendChild(proLabel);
        }
        
        // Stack size
        const stackDisplay = document.createElement('div');
        stackDisplay.className = 'player-stack';
        stackDisplay.textContent = `$${player.stack}`;
        playerSeat.appendChild(stackDisplay);
        
        // Display current bet if any
        if (player.currentBet > 0) {
            const betDisplay = document.createElement('div');
            betDisplay.className = 'player-bet';
            betDisplay.textContent = `$${player.currentBet}`;
            playerSeat.appendChild(betDisplay);
        }
        
        tableElement.appendChild(playerSeat);
        
        // Player cards (only show for real player) - positioned absolutely
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
    });
}

const createCardElement = (cardString, className = 'card') => {
    const cardElement = document.createElement('div');
    cardElement.className = className;
    
    // Handle undefined or null card strings
    if (!cardString) {
        console.warn('Card string is undefined or null');
        cardElement.textContent = '';
        return cardElement;
    }
    
    // Determine if card is red or black based on suit
    if (cardString.includes('♥') || cardString.includes('♦')) {
        cardElement.classList.add('red');
    } else {
        cardElement.classList.add('black');
    }
    
    cardElement.textContent = cardString;
    return cardElement;
}



const displayCardsAtCenter = (cards) => {
    let communityCardsContainer = document.getElementById('community-cards');
    
    // If container doesn't exist, try to find the table center or create it
    if (!communityCardsContainer) {
        const tableCenter = document.querySelector('.table-center');
        if (tableCenter) {
            communityCardsContainer = tableCenter.querySelector('.community-cards');
        }
        
        // If still not found, create the container
        if (!communityCardsContainer) {
            const pokerTable = document.querySelector('.poker-table');
            if (!pokerTable) {
                console.error('Poker table not found. Please call displayTable first.');
                return;
            }
            
            // Find or create table center
            let tableCenter = pokerTable.querySelector('.table-center');
            if (!tableCenter) {
                tableCenter = document.createElement('div');
                tableCenter.className = 'table-center';
                pokerTable.appendChild(tableCenter);
            }
            
            // Create community cards container
            communityCardsContainer = document.createElement('div');
            communityCardsContainer.className = 'community-cards';
            communityCardsContainer.id = 'community-cards';
            tableCenter.appendChild(communityCardsContainer);
        }
    }
    
    communityCardsContainer.innerHTML = '';
    
    if (!Array.isArray(cards)) {
        console.error('Cards must be provided as an array');
        return;
    }
    
    // Filter out any undefined or null cards
    const validCards = cards.filter(card => card != null);
    
    validCards.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.style.animationDelay = `${index * 0.1}s`;
        cardElement.classList.add('card-deal-animation');
        communityCardsContainer.appendChild(cardElement);
    });
}

const updatePlayerStack = (player) => {
    const playerSeat = document.querySelector(`[data-position="${player.position}"]`);
    if (!playerSeat) return;
    
    const stackDisplay = playerSeat.querySelector('.player-stack');
    if (stackDisplay) {
        stackDisplay.textContent = `$${player.stack}`;
    }
}

const updateActivePlayer = (game) => {
    // Remove active class from all players
    document.querySelectorAll('.player-seat').forEach(seat => {
        seat.classList.remove('active-player');
    });
    
    // Add active class to current player
    const currentPlayer = game.players[game.currentPlayerIndex];
    const activePlayerSeat = document.querySelector(`[data-position="${currentPlayer.position}"]`);
    if (activePlayerSeat) {
        activePlayerSeat.classList.add('active-player');
    }
}

const updateFoldedPlayer = (player) => {
    const playerSeat = document.querySelector(`[data-position="${player.position}"]`);
    if (!playerSeat) return;
    
    playerSeat.classList.add('folded');
}

const clearBetAnimations = () => {
    // Remove all bet chip animations from the table
    const betChips = document.querySelectorAll('.bet-chip-animation');
    betChips.forEach(chip => {
        chip.remove();
    });
    
    // Also remove any player bet displays
    const playerBets = document.querySelectorAll('.player-bet');
    playerBets.forEach(bet => {
        bet.remove();
    });
}

const displayBet = (player, amount, game) => {
    // Get player seat element by data-position attribute
    const playerSeat = document.querySelector(`[data-position="${player.position}"]`);
    if (!playerSeat) return;
    
    // Create animated bet chip
    const betChip = document.createElement('div');
    betChip.className = 'bet-chip-animation';
    betChip.textContent = `$${amount}`;
    
    // Get player seat position
    const playerRect = playerSeat.getBoundingClientRect();
    const tableRect = document.querySelector('.poker-table').getBoundingClientRect();
    
    // Calculate starting position (from player)
    const startX = playerRect.left + playerRect.width / 2 - tableRect.left;
    const startY = playerRect.top + playerRect.height / 2 - tableRect.top;
    
    // Calculate end position (in front of player, towards center of table)
    const centerX = tableRect.width / 2;
    const centerY = tableRect.height / 2;
    
    // Get player's position
    const playerX = centerX + player.tableCoors.offsetX;
    const playerY = centerY + player.tableCoors.offsetY;
    
    // Calculate direction from player to center
    const dirX = centerX - playerX;
    const dirY = centerY - playerY;
    
    // Normalize direction
    const distance = Math.sqrt(dirX * dirX + dirY * dirY);
    const normalizedX = dirX / distance;
    const normalizedY = dirY / distance;
    
    // Place bet 80px in front of player towards center
    const betDistance = 80;
    const endX = playerX + normalizedX * betDistance;
    const endY = playerY + normalizedY * betDistance;
    
    // Set initial position
    betChip.style.left = `${startX}px`;
    betChip.style.top = `${startY}px`;
    betChip.style.transform = 'translate(-50%, -50%)';
    
    // Add to poker table
    document.querySelector('.poker-table').appendChild(betChip);
    
    // Animate to final position
    setTimeout(() => {
        betChip.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        betChip.style.left = `${endX}px`;
        betChip.style.top = `${endY}px`;
    }, 10);
    
    // Update pot size
    const potElement = document.querySelector('.pot-size');
    if (potElement) {
        potElement.textContent = `Pot: $${game.totalMoneyInTheMiddle}`;
    }
    
    // Remove bet display from player seat after animation
    setTimeout(() => {
        const playerBetDisplay = playerSeat.querySelector('.player-bet');
        if (playerBetDisplay) {
            playerBetDisplay.remove();
        }
    }, 800);
}


const showWrongBetIndication = () => {
    const existingMessage = document.querySelector('.wrong-bet-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'wrong-bet-message';
    message.textContent = 'Wrong Bet Option!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 1500);
    
    const buttons = document.querySelectorAll('.bet-option-button');
    buttons.forEach(button => {
        button.classList.add('wrong-bet-shake');
    });
    
    setTimeout(() => {
        buttons.forEach(button => {
            button.classList.remove('wrong-bet-shake');
        });
    }, 500);
}

const getBetOptionResult = async (game) => {
    const betOptions = getAvaliableBetOptions(game);
    
    return new Promise((resolve) => {
        const existingButtons = document.querySelector('.bet-options-container');
        if (existingButtons) {
            existingButtons.remove();
        }
        
        const betOptionsContainer = document.createElement('div');
        betOptionsContainer.className = 'bet-options-container';
        
        const keyboardShortcuts = ['1', '2', '3', 'q', 'w', 'e', 'a', 's', 'd'];
        const keyMap = {};
        
        betOptions.forEach((option, index) => {
            const button = document.createElement('button');
            // Handle different option types for CSS classes
            let className = 'bet-option-button';
            if (option === 'fold') {
                className += ' fold';
            } else if (option === 'check') {
                className += ' check';
            } else if (option === 'call') {
                className += ' call';
            } else if (option === 'all in') {
                className += ' all';
            } else if (option.includes('%')) {
                // For percentage options, add the percentage value as part of the class
                className += ` ${option}`;
            } else if (option.includes('x')) {
                // For multiplier options like 2x, 3x, 4x
                className += ` ${option.toLowerCase().replace('x', 'bet')}`;
            }
            button.className = className;
            
            const shortcut = keyboardShortcuts[index];
            keyMap[shortcut] = option;
            
            const buttonContent = document.createElement('div');
            buttonContent.innerHTML = `${option.toUpperCase()}<br><span style="font-size: 0.8em; opacity: 0.7">[${shortcut.toUpperCase()}]</span>`;
            button.appendChild(buttonContent);
            
            button.addEventListener('click', () => {
                betOptionsContainer.remove();
                document.removeEventListener('keydown', handleKeyPress);
                resolve(option);
            });
            betOptionsContainer.appendChild(button);
        });
        
        const handleKeyPress = (e) => {
            const key = e.key.toLowerCase();
            if (keyMap[key]) {
                let i = keyboardShortcuts.indexOf(key)
                if (i >= betOptions.length) return
                betOptionsContainer.remove();
                document.removeEventListener('keydown', handleKeyPress);
                resolve(betOptions[i]);
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        document.body.appendChild(betOptionsContainer);
    });
}


export { displayTable, displayPlayers, displayBet, getBetOptionResult, updatePlayerStack, updateActivePlayer, updateFoldedPlayer, displayCardsAtCenter, clearBetAnimations, showWrongBetIndication };