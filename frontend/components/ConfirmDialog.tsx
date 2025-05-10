'use client';

import React from 'react';

interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

            {/* Popup Card */}
            <div className="relative bg-green-50 border border-green-200 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-center">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">Confirm Action</h2>
                    <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">{message}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
