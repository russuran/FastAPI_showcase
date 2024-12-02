import React from 'react';
import '../../styles/LoadingSpinner.css'; // Импортируем CSS для спиннера

function LoadingSpinner() {
    return (
        <div className='loader-div'>
            <span className="loader-spin"></span>
        </div>
    );
}

export default LoadingSpinner;
