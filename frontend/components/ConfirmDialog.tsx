'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

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
                    <Button
                        onClick={onConfirm}
                        variant="primary"
                        className="px-6"
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        className="px-6"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
