
const getHands = async (game) => {
    return new Promise((resolve) => {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        const container = document.createElement('div');
        container.className = 'question-modal cards-modal';

        const title = document.createElement('h2');
        title.textContent = 'Select Your Hand (2 cards)';
        title.className = 'question-title';
        container.appendChild(title);

        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-cards-display';
        container.appendChild(selectedDisplay);

        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'cards-grid';

        const selectedCards = [];
        const cardButtons = [];

        suits.forEach(suit => {
            ranks.forEach(rank => {
                const card = rank + suit;
                const button = document.createElement('button');
                button.textContent = card;
                button.className = `card-button ${suit === '♥' || suit === '♦' ? 'red-suit' : 'black-suit'}`;

                button.addEventListener('click', () => {
                    if (selectedCards.includes(card)) {
                        const index = selectedCards.indexOf(card);
                        selectedCards.splice(index, 1);
                        button.classList.remove('selected');
                    } else if (selectedCards.length < 2) {
                        selectedCards.push(card);
                        button.classList.add('selected');
                    }
                    
                    selectedDisplay.textContent = selectedCards.join(' ');
                    
                    if (selectedCards.length === 2) {
                        confirmButton.classList.remove('hidden');
                    } else {
                        confirmButton.classList.add('hidden');
                    }
                });

                cardButtons.push(button);
                cardsGrid.appendChild(button);
            });
        });

        container.appendChild(cardsGrid);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm Hand';
        confirmButton.className = 'confirm-button hidden';

        confirmButton.addEventListener('click', () => {
            const realPlayer = game.players.find(p => p.isRealPlayer);
            if (realPlayer) {
                realPlayer.hand = selectedCards.join(' ');
            }
            
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            resolve(selectedCards);
        });

        container.appendChild(confirmButton);

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
}

export default getHands;