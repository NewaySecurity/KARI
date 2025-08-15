import { CANDY_TYPES } from './constants';

export type CandyType = typeof CANDY_TYPES[number];

export type PowerUpType = 'striped-h' | 'striped-v' | 'color-bomb' | null;

export type IconName = 'level' | 'moves' | 'score' | 'highScore' | 'checkmark';

export interface Position {
    row: number;
    col: number;
}

export interface Candy {
    id: string;
    type: CandyType;
    powerUp: PowerUpType;
}

export type GameGrid = (Candy | null)[][];

export type CandyClearObjective = {
    [key in CandyType]?: number;
};

export interface LevelObjectives {
    targetScore: number;
    clearCandies?: CandyClearObjective;
}

export interface LevelDefinition {
    level: number;
    objectives: LevelObjectives;
}

export interface ObjectiveProgress {
    clearedCandies: {
        [key in CandyType]?: number;
    };
}