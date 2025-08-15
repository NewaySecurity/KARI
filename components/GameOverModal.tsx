import React from 'react';

interface GameOverModalProps {
    score: number;
    highScore: number;
    onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform transition-all scale-100 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Game Over!</h2>
                <p className="text-lg mb-2">Your score:</p>
                <p className="text-5xl sm:text-6xl font-bold mb-6">{score}</p>
                {score >= highScore && <p className="text-yellow-300 font-bold mb-4">New High Score!</p>}
                <button
                    onClick={onRestart}
                    className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};