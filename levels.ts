
import type { LevelDefinition } from './types';

export const LEVELS: LevelDefinition[] = [
    {
        level: 1,
        objectives: {
            targetScore: 1000,
            clearCandies: {
                red: 15,
                blue: 15,
            },
        },
    },
    {
        level: 2,
        objectives: {
            targetScore: 2500,
            clearCandies: {
                green: 20,
                yellow: 20,
            },
        },
    },
    {
        level: 3,
        objectives: {
            targetScore: 5000,
            clearCandies: {
                purple: 25,
                orange: 25,
            },
        },
    },
    {
        level: 4,
        objectives: {
            targetScore: 7500,
            clearCandies: {
                red: 20,
                blue: 20,
                green: 20,
            },
        },
    },
    {
        level: 5,
        objectives: {
            targetScore: 10000,
        }
    }
];
