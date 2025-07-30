

const showPositions = async (game, onSelect, multiSelect = false) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal';

        const title = document.createElement('h2');
        title.textContent = multiSelect ? 'Select Pro Players' : 'Select Your Position';
        title.className = 'question-title';
        container.appendChild(title);

        const positionsGrid = document.createElement('div');
        positionsGrid.className = 'positions-grid';

        const selectedPositions = new Set();
        const positionButtons = [];

        game.players.forEach((player, index) => {
            if (!player) return;
            
            if (!multiSelect || !player.isRealPlayer) {
                const button = document.createElement('button');
                button.textContent = player.position;
                button.className = 'position-button';

                button.addEventListener('click', () => {
                    if (multiSelect) {
                        if (selectedPositions.has(player.position)) {
                            selectedPositions.delete(player.position);
                            button.classList.remove('selected');
                        } else {
                            selectedPositions.add(player.position);
                            button.classList.add('selected');
                        }
                    } else {
                        selectedPositions.clear();
                        positionButtons.forEach(btn => {
                            btn.classList.remove('selected');
                        });
                        selectedPositions.add(player.position);
                        button.classList.add('selected');
                        
                        setTimeout(() => {
                            document.body.removeChild(container);
                            document.body.removeChild(overlay);
                            if (onSelect) onSelect(player.position);
                            resolve(player.position);
                        }, 200);
                    }
                });

                positionButtons.push(button);
                positionsGrid.appendChild(button);
            }
        });

        container.appendChild(positionsGrid);

        if (multiSelect) {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm Selection';
            confirmButton.className = 'confirm-button';

            confirmButton.addEventListener('click', () => {
                document.body.removeChild(container);
                document.body.removeChild(overlay);
                const selectedArray = Array.from(selectedPositions);
                if (onSelect) onSelect(selectedArray);
                resolve(selectedArray);
            });

            container.appendChild(confirmButton);
        }

        const overlay = document.createElement('div');
        overlay.className = 'question-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    });
};

export default showPositions;