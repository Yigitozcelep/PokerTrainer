
const getStack = async (game) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal stack-modal';

        const title = document.createElement('h2');
        title.textContent = 'Enter Stack Size';
        title.className = 'question-title';
        container.appendChild(title);

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter stack size...';
        input.className = 'stack-input';
        container.appendChild(input);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.className = 'confirm-button';

        confirmButton.addEventListener('click', () => {
            const stackSize = parseInt(input.value);
            if (!isNaN(stackSize) && stackSize > 0) {
                game.players.forEach(player => {
                    player.stack = stackSize;
                });
                
                document.body.removeChild(container);
                document.body.removeChild(overlay);
                resolve(stackSize);
            } else {
                input.classList.add('error');
                input.focus();
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'cancel-button';

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(container);
            document.body.removeChild(overlay);
            resolve(null);
        });

        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        container.appendChild(buttonContainer);
        input.value = 200
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmButton.click();
            }
        });

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
        
        input.focus();
    });
}

export default getStack;