import * as React from 'react';

export const Modal = ({isOpen, body, onClose}) => {
    
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