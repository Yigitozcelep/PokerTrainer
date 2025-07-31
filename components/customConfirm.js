export const customConfirm = (message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'custom-confirm-modal';
        
        const messageElement = document.createElement('p');
        messageElement.className = 'custom-confirm-message';
        messageElement.textContent = message;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'custom-confirm-buttons';
        
        const confirmButton = document.createElement('button');
        confirmButton.className = 'custom-confirm-button confirm';
        confirmButton.textContent = 'Yes';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'custom-confirm-button cancel';
        cancelButton.textContent = 'No';
        
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);
        
        modal.appendChild(messageElement);
        modal.appendChild(buttonsContainer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const cleanup = () => {
            document.removeEventListener('keydown', handleKeydown);
            overlay.remove();
        };
        
        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };
        
        const handleCancel = () => {
            cleanup();
            resolve(false);
        };
        
        const handleKeydown = (event) => {
            if (event.key === 'Enter') {
                handleConfirm();
            } else if (event.key === 'Escape') {
                handleCancel();
            }
        };
        
        confirmButton.addEventListener('click', handleConfirm);
        cancelButton.addEventListener('click', handleCancel);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                handleCancel();
            }
        });
        
        document.addEventListener('keydown', handleKeydown);
        
        confirmButton.focus();
    });
};