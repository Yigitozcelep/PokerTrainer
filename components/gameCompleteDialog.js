export const showGameCompleteDialog = (message, name, path) => {
    return new Promise((resolve) => {
        console.log("name: ", name, "path: ", path)
        const overlay = document.createElement('div');
        overlay.className = 'game-complete-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'game-complete-modal';
        modal.tabIndex = -1; // Make modal focusable
        
        const messageElement = document.createElement('p');
        messageElement.className = 'game-complete-message';
        messageElement.textContent = message || 'Game Complete!';
        modal.appendChild(messageElement);
        
        if (name) {
            const nameElement = document.createElement('p');
            nameElement.className = 'game-complete-name';
            nameElement.textContent = `Name: ${name}`;
            modal.appendChild(nameElement);
        }
        
        if (path) {
            const pathElement = document.createElement('p');
            pathElement.className = 'game-complete-path';
            pathElement.textContent = `Path: ${path}`;
            modal.appendChild(pathElement);
        }
        
        const instruction = document.createElement('p');
        instruction.className = 'game-complete-instruction';
        instruction.textContent = 'Press Enter to continue or Q to quit training';
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