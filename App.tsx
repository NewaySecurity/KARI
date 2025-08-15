import React from 'react';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { GameOverModal } from './components/GameOverModal';
import { useGameLogic } from './hooks/useGameLogic';

const App: React.FC = () => {
    const {
        grid,
        score,
        level,
        highScore,
        movesLeft,
        isGameOver,
        handleCandyClick,
        selectedCandy,
        isProcessing,
        restartGame,
        objectives,
        objectiveProgress,
    } = useGameLogic();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 bg-gray-900 bg-gradient-to-br from-indigo-900 via-gray-900 to-purple-900 font-sans">
            <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-8">
                <div className="w-full max-w-md lg:w-1/3 flex-shrink-0">
                    <Scoreboard 
                        score={score} 
                        level={level} 
                        highScore={highScore} 
                        movesLeft={movesLeft}
                        objectives={objectives}
                        objectiveProgress={objectiveProgress}
                    />
                </div>
                <div className="flex-grow flex items-center justify-center w-full lg:w-auto">
                    <GameBoard 
                        grid={grid} 
                        onCandyClick={handleCandyClick}
                        selectedCandy={selectedCandy}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>
            {isGameOver && (
                <GameOverModal 
                    score={score} 
                    highScore={highScore}
                    onRestart={restartGame} 
                />
            )}
            <footer className="text-white text-center mt-4 sm:mt-8 text-xs sm:text-sm opacity-50">
                <p>by Brilliant Mashele (BubbleRoot Studios)</p>
                <p>&copy; Copyright 2025. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;