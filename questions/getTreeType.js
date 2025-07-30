
const getTreeType = async (game) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal';

        const title = document.createElement('h2');
        title.textContent = 'Select Game Type';
        title.className = 'question-title';
        container.appendChild(title);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'tree-options-container';

        const options = [
            { value: 'preflop', label: 'Preflop Only', description: 'Practice preflop decisions and ranges' },
            { value: 'full', label: 'Include Postflop', description: 'Practice both preflop and postflop play' }
        ];

        options.forEach(option => {
            const optionButton = document.createElement('div');
            optionButton.className = 'tree-option-button';
            
            const optionTitle = document.createElement('h3');
            optionTitle.textContent = option.label;
            optionTitle.className = 'tree-option-title';
            optionButton.appendChild(optionTitle);
            
            const optionDesc = document.createElement('p');
            optionDesc.textContent = option.description;
            optionDesc.className = 'tree-option-description';
            optionButton.appendChild(optionDesc);

            optionButton.addEventListener('click', () => {
                if (option.value === 'full') {
                    game.isPostflopInclude = true;
                } else {
                    game.isPostflopInclude = false;
                }
                
                document.body.removeChild(container);
                document.body.removeChild(overlay);
                game.isPostflopInclude = true
                resolve()
            });

            optionsContainer.appendChild(optionButton);
        });

        container.appendChild(optionsContainer);

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
}

export default getTreeType;