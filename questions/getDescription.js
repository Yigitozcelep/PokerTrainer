const getDescription = async (game) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal description-modal';

        const title = document.createElement('h2');
        title.textContent = 'Enter Game Description';
        title.className = 'question-title';
        container.appendChild(title);

        const textArea = document.createElement('textarea');
        textArea.className = 'description-textarea';
        textArea.placeholder = 'Enter a detailed description of this game scenario...';
        textArea.rows = 10;
        textArea.cols = 50;
        container.appendChild(textArea);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttonsContainer.style.marginTop = '20px';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.className = 'confirm-button';
        confirmButton.addEventListener('click', () => {
            const description = textArea.value.trim();
            if (description) {
                game.description = description;
                document.body.removeChild(container);
                document.body.removeChild(overlay);
                resolve(description);
            } else {
                textArea.classList.add('error');
                setTimeout(() => textArea.classList.remove('error'), 2000);
            }
        });

        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip';
        skipButton.className = 'skip-button';
        skipButton.style.cssText = `
            padding: 12px 24px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.2s;
            margin-left: 10px;
        `;
        skipButton.addEventListener('click', () => {
            game.description = '';
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            resolve('');
        });

        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(skipButton);
        container.appendChild(buttonsContainer);

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);

        // Focus on textarea when modal opens
        setTimeout(() => textArea.focus(), 100);
    });
};

export default getDescription;