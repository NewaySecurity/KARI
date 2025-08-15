import React from 'react';
import { CandyTile } from './CandyTile';
import type { GameGrid, Position } from '../types';

interface GameBoardProps {
    grid: GameGrid;
    onCandyClick: (row: number, col: number) => void;
    selectedCandy: Position | null;
    isProcessing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, onCandyClick, selectedCandy, isProcessing }) => {
    return (
        <div 
            className="grid p-2 bg-black bg-opacity-40 rounded-xl shadow-lg"
            style={{
                gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
                aspectRatio: '1 / 1',
                width: '100%',
                maxWidth: '500px',
                minWidth: '300px'
            }}
        >
            {grid.map((row, rowIndex) =>
                row.map((candy, colIndex) => {
                    const isSelected = selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex;
                    return (
                        <div key={`${rowIndex}-${colIndex}`} className="relative w-full h-full p-1">
                            {candy && (
                                <CandyTile
                                    candy={candy}
                                    onClick={() => onCandyClick(rowIndex, colIndex)}
                                    isSelected={isSelected}
                                    isProcessing={isProcessing}
                                />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};