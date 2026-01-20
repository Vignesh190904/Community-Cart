import React from 'react';

export default function AppLoading() {
    return (
        <div className="app-loading">
            <div className="loading-content">
                <img
                    src="/customer/assets/images/Vector.png"
                    alt="Community Cart Logo"
                    className="loading-logo"
                    onError={(e) => {
                        // Gracefully handle image load failure
                        console.warn('⚠️ Logo image failed to load');
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <h1 className="loading-title">Community Cart</h1>
            </div>
        </div>
    );
}
