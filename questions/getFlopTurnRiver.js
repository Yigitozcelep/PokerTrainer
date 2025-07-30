import selectCards from "./selectCards.js";

const selectOptionalCard = async (title, usedCards = []) => {
    return new Promise((resolve) => {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        const container = document.createElement('div');
        container.className = 'question-modal cards-modal';

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.className = 'question-title';
        container.appendChild(titleElement);

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
                
                const isUsed = usedCards.includes(card);
                if (isUsed) {
                    button.classList.add('used-card');
                    button.disabled = true;
                }

                button.addEventListener('click', () => {
                    if (selectedCards.includes(card)) {
                        const index = selectedCards.indexOf(card);
                        selectedCards.splice(index, 1);
                        button.classList.remove('selected');
                    } else if (selectedCards.length < 1) {
                        selectedCards.push(card);
                        button.classList.add('selected');
                        
                        selectedDisplay.textContent = card;
                        
                        document.body.removeChild(container);
                        document.body.removeChild(overlay);
                        resolve(selectedCards);
                    }
                });

                cardButtons.push(button);
                cardsGrid.appendChild(button);
            });
        });

        container.appendChild(cardsGrid);

        const skipButton = document.createElement('button');
        skipButton.textContent = 'No ' + (title.includes('Turn') ? 'Turn' : 'River') + ' Card';
        skipButton.className = 'skip-button';
        skipButton.style.cssText = `
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;
        
        skipButton.addEventListener('mouseenter', () => {
            skipButton.style.backgroundColor = '#5a6268';
        });
        
        skipButton.addEventListener('mouseleave', () => {
            skipButton.style.backgroundColor = '#6c757d';
        });

        skipButton.addEventListener('click', () => {
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            resolve(null);
        });

        container.appendChild(skipButton);

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
};

const getFlopTurnRiver = async (game, usedCards = []) => {
    const allUsedCards = [...usedCards];
    
    const flop = await selectCards('Select Flop (3 cards)', 3, true, allUsedCards);
    if (flop) {
        allUsedCards.push(...flop);
    }
    
    const turn = flop ? await selectOptionalCard('Select Turn', allUsedCards) : null;
    if (turn) {
        allUsedCards.push(...turn);
    }
    
    const river = turn ? await selectOptionalCard('Select River', allUsedCards) : null;
    
    game.flop = flop || null
    game.turn = turn || null
    game.river = river || null
} 

export default getFlopTurnRiver;