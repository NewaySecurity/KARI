import React from 'react';
import { CANDY_COLORS, CANDY_SHADOWS } from '../constants';
import type { Candy } from '../types';

interface CandyProps {
    candy: Candy;
    onClick: () => void;
    isSelected: boolean;
    isProcessing: boolean;
}

export const CandyTile: React.FC<CandyProps> = ({ candy, onClick, isSelected, isProcessing }) => {
    const colorClass = CANDY_COLORS[candy.type] || 'bg-gray-400';
    const shadowClass = CANDY_SHADOWS[candy.type] || '';
    
    const selectedClass = isSelected ? 'ring-4 ring-white ring-opacity-75 scale-110' : 'scale-100';
    const processingClass = isProcessing ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110';

    const powerUpClass = {
        'striped-h': "after:content-[''] after:absolute after:inset-1 after:bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.3),rgba(255,255,255,0.3)_3px,transparent_3px,transparent_9px)] after:rounded-md",
        'striped-v': "after:content-[''] after:absolute after:inset-1 after:bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.3)_3px,transparent_3px,transparent_9px)] after:rounded-md",
        'color-bomb': "after:content-[''] after:absolute after:inset-1.5 after:rounded-full after:bg-gray-800 after:animate-pulse after:shadow-[inset_0_0_4px_#000]"
    }[candy.powerUp || ''] || '';

    return (
        <div
            key={candy.id}
            className={`w-full h-full rounded-lg shadow-md transition-transform duration-200 ease-in-out relative ${colorClass} ${shadowClass} ${selectedClass} ${processingClass} ${powerUpClass}`}
            onClick={isProcessing ? undefined : onClick}
            style={{ transformOrigin: 'center' }}
        />
    );
};