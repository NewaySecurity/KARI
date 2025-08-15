import React from 'react';
import { Objectives } from './Objectives';
import { Icon } from './Icon';
import type { LevelObjectives, ObjectiveProgress, IconName } from '../types';

interface ScoreboardProps {
    score: number;
    level: number;
    highScore: number;
    movesLeft: number;
    objectives: LevelObjectives;
    objectiveProgress: ObjectiveProgress;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: IconName; large?: boolean }> = ({ title, value, icon, large = false }) => (
    <div className={`bg-indigo-900 bg-opacity-40 backdrop-blur-md p-2 sm:p-4 rounded-lg text-center text-white shadow-lg ${large ? 'col-span-2' : ''}`}>
        <div className="flex items-center justify-center gap-2">
            <Icon name={icon} className="w-4 h-4 text-indigo-200" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-200">{title}</h2>
        </div>
        <p className={`font-black ${large ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{value}</p>
    </div>
);

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, level, highScore, movesLeft, objectives, objectiveProgress }) => {
    return (
        <div className="w-full space-y-4 p-2 sm:p-4 bg-black bg-opacity-30 rounded-xl">
            <h1 className="text-6xl sm:text-7xl font-bold text-center text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" style={{fontFamily: "'Pacifico', cursive"}}>KARI</h1>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <StatCard title="Level" value={level} icon="level" />
                <StatCard title="Moves" value={movesLeft} icon="moves" />
                <StatCard title="Score" value={score} icon="score" large />
                <StatCard title="High Score" value={highScore} icon="highScore" large />
            </div>
            <Objectives objectives={objectives} progress={objectiveProgress} score={score} />
        </div>
    );
};