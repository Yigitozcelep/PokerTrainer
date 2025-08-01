
/** * @returns {Promise<boolean>} */
const showPositions = async (game, onSelect, textContext, multiSelect = false, isShowNoneButton = false) => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'question-modal';

        const title = document.createElement('h2');
        title.textContent = textContext
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
                        
                        document.body.removeChild(container);
                        document.body.removeChild(overlay);
                        if (onSelect) onSelect(player.position);
                        resolve(player.position);
                    }
                });

                positionButtons.push(button);
                positionsGrid.appendChild(button);
            }
        });

        container.appendChild(positionsGrid);

        if (isShowNoneButton) {
            const noneButton = document.createElement('button');
            noneButton.textContent = 'None';
            noneButton.className = 'none-button';
                
            noneButton.addEventListener("keydown", (e) => {
                console.log("keydown on none button:", e.key)
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.body.removeChild(container);
                    document.body.removeChild(overlay);
                    resolve(false)
                }
            })
            
            noneButton.addEventListener('click', () => {
                document.body.removeChild(container);
                document.body.removeChild(overlay);
                resolve(false);
            });

            container.appendChild(noneButton);
            
            // Focus the none button after a brief delay to ensure DOM is ready
            setTimeout(() => {
                noneButton.focus();
            }, 100);
        }

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