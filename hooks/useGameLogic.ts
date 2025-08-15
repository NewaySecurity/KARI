import { useState, useEffect, useCallback } from 'react';
import type { CandyType, Position, GameGrid, Candy, ObjectiveProgress, PowerUpType } from '../types';
import { BOARD_ROWS, BOARD_COLS, CANDY_TYPES, INITIAL_MOVES, SCORE_PER_CANDY } from '../constants';
import { LEVELS } from '../levels';

const createNewCandy = (type: CandyType, powerUp: PowerUpType = null): Candy => ({
    id: crypto.randomUUID(),
    type,
    powerUp,
});

const initialObjectiveProgress: ObjectiveProgress = {
    clearedCandies: {
        red: 0, orange: 0, yellow: 0, green: 0, blue: 0, purple: 0
    }
};

type MatchGroup = { positions: Position[], type: CandyType, size: number };

export const useGameLogic = () => {
    const [grid, setGrid] = useState<GameGrid>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [movesLeft, setMovesLeft] = useState(INITIAL_MOVES);
    const [selectedCandy, setSelectedCandy] = useState<Position | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [objectiveProgress, setObjectiveProgress] = useState<ObjectiveProgress>(initialObjectiveProgress);

    const currentLevelDefinition = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];

    const findMatches = useCallback((currentGrid: GameGrid): MatchGroup[] => {
        const allMatches: MatchGroup[] = [];
        const visited = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(false));

        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (visited[r][c] || !currentGrid[r][c]) continue;

                const candyType = currentGrid[r][c]!.type;

                // Horizontal match check
                let hMatch = [{ row: r, col: c }];
                for (let i = c + 1; i < BOARD_COLS; i++) {
                    if (currentGrid[r][i]?.type === candyType) hMatch.push({ row: r, col: i });
                    else break;
                }
                if (hMatch.length >= 3) {
                    allMatches.push({ positions: hMatch, type: candyType, size: hMatch.length });
                    hMatch.forEach(p => visited[p.row][p.col] = true);
                }

                // Vertical match check
                let vMatch = [{ row: r, col: c }];
                for (let i = r + 1; i < BOARD_ROWS; i++) {
                    if (currentGrid[i][c]?.type === candyType) vMatch.push({ row: i, col: c });
                    else break;
                }
                if (vMatch.length >= 3) {
                    allMatches.push({ positions: vMatch, type: candyType, size: vMatch.length });
                    // Avoid double marking start cell if it's part of both h and v match
                    vMatch.forEach(p => visited[p.row][p.col] = true);
                }
            }
        }
        return allMatches;
    }, []);

    const processMatchesAndCascades = useCallback(async (
        gridAfterSwap: GameGrid,
        swapInfo?: { from: Position, to: Position, fromCandy: Candy, toCandy: Candy }
    ): Promise<boolean> => {
        setIsProcessing(true);
        let currentGrid = gridAfterSwap.map(r => r.map(c => c ? {...c} : null));
        let totalScoreGained = 0;
        const allMatchedCandies: CandyType[] = [];
        let madeChanges = false;
        
        while (true) {
            const positionsToClear = new Set<string>();
            const powerUpCreationQueue = new Map<string, PowerUpType>();
            
            // Check for power-up activations from the swap
            if (swapInfo) {
                const { from, to, fromCandy, toCandy } = swapInfo;
                if (fromCandy.powerUp === 'color-bomb') {
                    for(let r=0; r<BOARD_ROWS; r++) for(let c=0; c<BOARD_COLS; c++) if(currentGrid[r][c]?.type === toCandy.type) positionsToClear.add(`${r},${c}`);
                    positionsToClear.add(`${from.row},${from.col}`);
                }
                if (toCandy.powerUp === 'color-bomb') {
                    for(let r=0; r<BOARD_ROWS; r++) for(let c=0; c<BOARD_COLS; c++) if(currentGrid[r][c]?.type === fromCandy.type) positionsToClear.add(`${r},${c}`);
                    positionsToClear.add(`${to.row},${to.col}`);
                }
            }

            const matches = findMatches(currentGrid);
            
            matches.forEach(match => {
                match.positions.forEach(p => {
                    const candy = currentGrid[p.row][p.col];
                    if (candy?.powerUp === 'striped-h') for(let i=0; i<BOARD_COLS; i++) positionsToClear.add(`${p.row},${i}`);
                    if (candy?.powerUp === 'striped-v') for(let i=0; i<BOARD_ROWS; i++) positionsToClear.add(`${i},${p.col}`);
                });
            });

            matches.forEach(match => {
                match.positions.forEach(p => positionsToClear.add(`${p.row},${p.col}`));

                if (match.size >= 4) {
                    let creationPos = match.positions[0];
                    if (swapInfo && match.positions.some(p => p.row === swapInfo.to.row && p.col === swapInfo.to.col)) {
                        creationPos = swapInfo.to;
                    }

                    if (positionsToClear.has(`${creationPos.row},${creationPos.col}`)) { // Ensure we don't overwrite another powerup
                         if (match.size === 5) {
                            powerUpCreationQueue.set(`${creationPos.row},${creationPos.col}`, 'color-bomb');
                        } else if (match.size === 4) {
                            const isHorizontal = match.positions[0].row === match.positions[1].row;
                            powerUpCreationQueue.set(`${creationPos.row},${creationPos.col}`, isHorizontal ? 'striped-v' : 'striped-h');
                        }
                    }
                }
            });

            if (positionsToClear.size === 0) break;
            
            madeChanges = true;

            const clearedCandies: Candy[] = [];
            positionsToClear.forEach(posStr => {
                const [r, c] = posStr.split(',').map(Number);
                if (currentGrid[r][c]) clearedCandies.push(currentGrid[r][c]!);
            });

            totalScoreGained += clearedCandies.length * SCORE_PER_CANDY;
            allMatchedCandies.push(...clearedCandies.map(c => c.type));

            let nextGrid = currentGrid.map(r => [...r]);
            positionsToClear.forEach(posStr => {
                const [r, c] = posStr.split(',').map(Number);
                nextGrid[r][c] = null;
            });
            
            powerUpCreationQueue.forEach((powerUp, posStr) => {
                const [r, c] = posStr.split(',').map(Number);
                const originalCandyType = clearedCandies.find(candy => 
                    gridAfterSwap[r][c] && candy.id === gridAfterSwap[r][c]!.id
                )?.type;
                if (originalCandyType) {
                    nextGrid[r][c] = createNewCandy(originalCandyType, powerUp);
                }
            });

            setGrid(nextGrid.map(r => [...r]));
            await new Promise(res => setTimeout(res, 200));

            // Gravity and Refill
            for (let c = 0; c < BOARD_COLS; c++) {
                let emptyRow = BOARD_ROWS - 1;
                for (let r = BOARD_ROWS - 1; r >= 0; r--) {
                    if (nextGrid[r][c] !== null) {
                        [nextGrid[r][c], nextGrid[emptyRow][c]] = [nextGrid[emptyRow][c], nextGrid[r][c]];
                        emptyRow--;
                    }
                }
            }
             for (let r = 0; r < BOARD_ROWS; r++) {
                for (let c = 0; c < BOARD_COLS; c++) {
                    if (nextGrid[r][c] === null) {
                        nextGrid[r][c] = createNewCandy(CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)]);
                    }
                }
            }
            currentGrid = nextGrid;
            setGrid(currentGrid.map(r => [...r]));
            await new Promise(res => setTimeout(res, 200));

            // The swap is only relevant for the first iteration
            swapInfo = undefined;
        }

        if (totalScoreGained > 0) setScore(prev => prev + totalScoreGained);
        if (allMatchedCandies.length > 0) {
             setObjectiveProgress(prev => {
                const newCleared = { ...prev.clearedCandies };
                allMatchedCandies.forEach(type => {
                    newCleared[type] = (newCleared[type] || 0) + 1;
                });
                return { clearedCandies: newCleared };
            });
        }
        setIsProcessing(false);
        return madeChanges;
    }, [findMatches]);

    const initializeBoard = useCallback(() => {
        const newGrid: GameGrid = [];
        for (let row = 0; row < BOARD_ROWS; row++) {
            newGrid[row] = [];
            for (let col = 0; col < BOARD_COLS; col++) {
                 let newCandyType: CandyType;
                do {
                    newCandyType = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
                } while (
                    (col >= 2 && newGrid[row][col - 1]?.type === newCandyType && newGrid[row][col - 2]?.type === newCandyType) ||
                    (row >= 2 && newGrid[row - 1][col]?.type === newCandyType && newGrid[row - 2][col]?.type === newCandyType)
                );
                newGrid[row][col] = createNewCandy(newCandyType);
            }
        }
        
        const matches = findMatches(newGrid);
        if (matches.length > 0) {
            initializeBoard(); // Re-initialize if board starts with matches
        } else {
            setGrid(newGrid);
        }
    }, [findMatches]);

    useEffect(() => {
        initializeBoard();
        const savedHighScore = localStorage.getItem('candyCrushHighScore');
        if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    }, [initializeBoard]);

    const handleCandyClick = useCallback((row: number, col: number) => {
        if (isProcessing || isGameOver) return;

        if (!selectedCandy) {
            setSelectedCandy({ row, col });
            return;
        }

        const isAdjacent = Math.abs(selectedCandy.row - row) + Math.abs(selectedCandy.col - col) === 1;

        if (isAdjacent) {
            setMovesLeft(prev => prev - 1);
            const newGrid = [...grid.map(r => [...r])];
            const fromCandy = newGrid[selectedCandy.row][selectedCandy.col]!;
            const toCandy = newGrid[row][col]!;
            newGrid[selectedCandy.row][selectedCandy.col] = toCandy;
            newGrid[row][col] = fromCandy;
            
            setGrid(newGrid);

            setTimeout(async () => {
                const madeMatches = await processMatchesAndCascades(newGrid, { from: selectedCandy, to: { row, col }, fromCandy, toCandy });
                if (!madeMatches) {
                     setIsProcessing(true);
                     setTimeout(() => {
                        setGrid(grid); // Revert to original grid
                        setMovesLeft(prev => prev + 1);
                        setIsProcessing(false);
                     }, 300);
                }
            }, 100);

            setSelectedCandy(null);
        } else {
            setSelectedCandy({ row, col });
        }
    }, [selectedCandy, grid, isProcessing, isGameOver, processMatchesAndCascades]);

    const restartGame = useCallback(() => {
        setScore(0);
        setLevel(1);
        setMovesLeft(INITIAL_MOVES);
        setIsGameOver(false);
        setObjectiveProgress(initialObjectiveProgress);
        initializeBoard();
    }, [initializeBoard]);
    
    useEffect(() => {
        const { objectives } = currentLevelDefinition;
        let scoreMet = score >= objectives.targetScore;
        let candiesMet = true;

        if (objectives.clearCandies) {
            for (const key in objectives.clearCandies) {
                const candyType = key as CandyType;
                const target = objectives.clearCandies[candyType] || 0;
                const progress = objectiveProgress.clearedCandies[candyType] || 0;
                if (progress < target) {
                    candiesMet = false;
                    break;
                }
            }
        }
        
        if (scoreMet && candiesMet) {
            if (LEVELS[level]) {
                setLevel(prev => prev + 1);
                setMovesLeft(prev => prev + 15);
                setObjectiveProgress(initialObjectiveProgress);
            } else {
                setIsGameOver(true);
            }
        }
    }, [score, objectiveProgress, level, currentLevelDefinition]);
    
    useEffect(() => {
        if (movesLeft <= 0 && !isProcessing) {
            setIsGameOver(true);
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('candyCrushHighScore', score.toString());
            }
        }
    }, [movesLeft, score, highScore, isProcessing]);

    return {
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
        objectives: currentLevelDefinition.objectives,
        objectiveProgress,
    };
};