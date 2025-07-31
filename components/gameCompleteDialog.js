export const showGameCompleteDialog = (message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'game-complete-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'game-complete-modal';
        modal.tabIndex = -1; // Make modal focusable
        
        const messageElement = document.createElement('p');
        messageElement.className = 'game-complete-message';
        messageElement.textContent = message || 'Game Complete!';
        
        const instruction = document.createElement('p');
        instruction.className = 'game-complete-instruction';
        instruction.textContent = 'Press Enter to continue or Q to quit training';
        
        modal.appendChild(messageElement);
        modal.appendChild(instruction);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Clean up any remaining bet option containers
        const existingBetOptions = document.querySelector('.bet-options-container');
        if (existingBetOptions) {
            existingBetOptions.remove();
        }
        
        // Focus the modal to ensure keyboard events work
        setTimeout(() => {
            modal.focus();
        }, 100);
        
        const cleanup = () => {
            document.removeEventListener('keydown', handleKeydown, true);
            overlay.remove();
        };
        
        const handleKeydown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default behavior
                event.stopPropagation(); // Stop event propagation
                cleanup();
                resolve('continue');
            } else if (event.key === 'q' || event.key === 'Q') {
                event.preventDefault(); // Prevent default behavior
                event.stopPropagation(); // Stop event propagation
                cleanup();
                resolve('quit');
            }
        };
        
        // Use capture phase to ensure we get the event first
        document.addEventListener('keydown', handleKeydown, true);
        
        overlay.addEventListener('click', () => {
            cleanup();
            resolve('continue');
        });
    });
};