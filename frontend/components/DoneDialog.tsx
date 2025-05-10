'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface DoneDialogProps {
    message: string;
    onDone: () => void;
    autoCloseDelay?: number;
    autoHide?: boolean;
}

export default function DoneDialog({ 
    message, 
    onDone, 
    autoCloseDelay = 3000,
    autoHide = true
}: DoneDialogProps) {
    const [isVisible, setIsVisible] = useState(true);
    const dialogRef = useRef<HTMLDivElement>(null);

    const closeDialog = useCallback(() => {
        setIsVisible(false);
        onDone();
    }, [onDone]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if the dialog is visible and the key is Enter or Escape
            if ((e.key === 'Enter' || e.key === 'Escape') && isVisible) {
                e.preventDefault();
                closeDialog();
            }
        };

        // Add event listener to the document
        document.addEventListener('keydown', handleKeyDown);

        // Optional: Auto-close timer if autoHide is true
        let timer: NodeJS.Timeout | null = null;
        if (autoHide) {
            timer = setTimeout(closeDialog, autoCloseDelay);
        }

        return () => {
            if (timer) clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeDialog, autoCloseDelay, autoHide, isVisible]);

    const handleClose = () => {
        closeDialog();
    };

    if (!isVisible) return null;

    return (
        <div 
            ref={dialogRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            tabIndex={-1}  // Make div focusable
        >
            {/* Background */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

            {/* Popup Card */}
            <div className="relative bg-green-50 border border-green-200 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-center animate-fade-in">
                <div className="mb-6">
                    {/* Animated Checkmark */}
                    <div className="flex justify-center mb-4">
                        <svg 
                            className="w-20 h-20 text-green-600 animate-checkmark"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-green-800 mb-4">Success</h2>
                    <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
