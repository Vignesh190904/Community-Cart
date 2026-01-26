import React from 'react';

export const SkeletonProductCard = () => (
    <div className="product-card">
        <div className="product-card-header" style={{ justifyContent: 'flex-end', padding: '8px' }}>
            <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
        </div>

        <div className="product-image-wrapper">
            <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
        </div>

        <div className="product-card-body">
            <div className="skeleton skeleton-text" style={{ width: '80%', height: '1.2em' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '1em' }}></div>
            <div className="product-price-wrapper">
                <div className="skeleton skeleton-text" style={{ width: '30%', height: '1.2em' }}></div>
            </div>
        </div>

        <div className="product-card-footer">
            <div className="skeleton" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
        </div>
    </div>
);
