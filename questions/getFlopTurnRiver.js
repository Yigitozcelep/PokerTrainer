
import selectCards from './selectCards.js';

const selectOptionalCard = async (title, description) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal';

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.className = 'question-title';
        container.appendChild(titleElement);

        const descElement = document.createElement('p');
        descElement.textContent = description;
        descElement.className = 'question-description';
        container.appendChild(descElement);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select Card';
        selectButton.className = 'option-button';
        
        const skipButton = document.createElement('button');
        skipButton.textContent = 'No ' + (title.includes('Turn') ? 'Turn' : 'River');
        skipButton.className = 'option-button secondary';

        selectButton.addEventListener('click', async () => {
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            const cards = await selectCards(title + ' (1 card)', 1);
            resolve(cards[0]);
        });

        skipButton.addEventListener('click', () => {
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            resolve(null);
        });

        buttonsContainer.appendChild(selectButton);
        buttonsContainer.appendChild(skipButton);
        container.appendChild(buttonsContainer);

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
};

const getFlopTurnRiver = async (game) => {
    const flop = await selectCards('Select Flop (3 cards)', 3);
    const turn = await selectOptionalCard('Select Turn', 'Would you like to include a turn card?');
    const river = turn ? await selectOptionalCard('Select River', 'Would you like to include a river card?') : null;
    
    game.flop = flop.join(' ')
    game.turn = turn || null,
    game.river = river || null
}

export default getFlopTurnRiver;