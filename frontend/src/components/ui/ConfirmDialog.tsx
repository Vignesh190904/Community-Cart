import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle ESC key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Lock scroll
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = ''; // Unlock scroll
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onCancel();
        }
    };

    return (
        <div
            className="confirm-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="confirm-dialog">
                <h2 className="confirm-title">{title}</h2>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button
                        className="confirm-btn confirm-btn-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="confirm-btn confirm-btn-confirm"
                        onClick={onConfirm}
                        autoFocus
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
