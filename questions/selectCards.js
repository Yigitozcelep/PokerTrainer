const selectCards = async (title, maxCards, optional = false, usedCards = []) => {
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
                    } else if (selectedCards.length < maxCards) {
                        selectedCards.push(card);
                        button.classList.add('selected');
                    }
                    
                    selectedDisplay.textContent = selectedCards.join(' ');
                    
                    if (selectedCards.length === maxCards) {
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

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttonsContainer.style.marginTop = '20px';

        if (!optional) {
            container.appendChild(buttonsContainer);
        }

        if (optional) {
            const skipButton = document.createElement('button');
            skipButton.textContent = 'No Flop Cards';
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
        }

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
}

export default selectCards;