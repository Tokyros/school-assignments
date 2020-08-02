import * as React from 'react';

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    body: any;
}

export const Modal: React.FC<ModalProps> = ({isOpen, body, onClose}) => {
    
    return isOpen ? 
        <div className='modal'>
            {body}
            <button
                style={{marginTop: '10px'}}
                onClick={onClose}>
                    Close
            </button>
        </div>
    : null;
}