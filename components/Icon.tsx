import React from 'react';
import type { IconName } from '../types';

interface IconProps {
    name: IconName;
    className?: string;
}

const ICONS: Record<IconName, React.ReactNode> = {
    level: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
    ),
    moves: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.42 19.58 12 12l6.58 7.58"></path><path d="m12 12-6.58-7.58L12 12l6.58-7.58"></path>
        </svg>
    ),
    score: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2.5l2.5 5L6 10H3.5L1 5l2.5-2.5H6Z"></path><path d="M18 2.5l-2.5 5L18 10h2.5L23 5l-2.5-2.5H18Z"></path><path d="M12 11.5 14.5 14 12 19l-2.5-5L12 11.5Z"></path><path d="m2.5 11.5 9.5 9.5 9.5-9.5"></path>
        </svg>
    ),
    highScore: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M8 12h8"></path><path d="M12 12V2"></path><path d="M7 4h2"></path><path d="M15 4h2"></path>
        </svg>
    ),
    checkmark: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
};

export const Icon: React.FC<IconProps> = ({ name, className }) => {
    return <div className={className}>{ICONS[name]}</div>;
};
