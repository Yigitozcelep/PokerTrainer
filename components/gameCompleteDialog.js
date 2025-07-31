export const showGameCompleteDialog = (message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'game-complete-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'game-complete-modal';
        
        const messageElement = document.createElement('p');
        messageElement.className = 'game-complete-message';
        messageElement.textContent = message || 'Game Complete!';
        
        const instruction = document.createElement('p');
        instruction.className = 'game-complete-instruction';
        instruction.textContent = 'Press Enter to continue';
        
        modal.appendChild(messageElement);
        modal.appendChild(instruction);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const cleanup = () => {
            document.removeEventListener('keydown', handleKeydown);
            overlay.remove();
        };
        
        const handleKeydown = (event) => {
            if (event.key === 'Enter') {
                cleanup();
                resolve();
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
        
        overlay.addEventListener('click', () => {
            cleanup();
            resolve();
        });
    });
};