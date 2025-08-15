import React from 'react';
import type { LevelObjectives, ObjectiveProgress, CandyType } from '../types';
import { CANDY_COLORS } from '../constants';
import { Icon } from './Icon';

interface ObjectivesProps {
    objectives: LevelObjectives;
    progress: ObjectiveProgress;
    score: number;
}

const ObjectiveItem: React.FC<{ children: React.ReactNode; completed: boolean }> = ({ children, completed }) => (
    <div className={`flex items-center gap-3 transition-all duration-300 ${completed ? 'opacity-50 text-gray-300' : 'opacity-100'}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${completed ? 'bg-green-400' : 'bg-white bg-opacity-30'}`}>
            {completed && <Icon name="checkmark" className="w-3 h-3 text-black" />}
        </div>
        <span className={`text-sm ${completed ? 'line-through' : ''}`}>{children}</span>
    </div>
);

const CandyIcon: React.FC<{ type: CandyType }> = ({ type }) => (
    <div className={`w-5 h-5 rounded-full inline-block mr-2 shadow-inner ${CANDY_COLORS[type]}`}></div>
);

export const Objectives: React.FC<ObjectivesProps> = ({ objectives, progress, score }) => {
    const { targetScore, clearCandies } = objectives;

    const isScoreMet = score >= targetScore;

    return (
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 sm:p-4 rounded-lg text-white shadow-lg space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200 text-center border-b border-white border-opacity-20 pb-2 mb-3">Objectives</h3>
            
            <ObjectiveItem completed={isScoreMet}>
                Score {targetScore.toLocaleString()} points ({score.toLocaleString()})
            </ObjectiveItem>

            {clearCandies && Object.entries(clearCandies).map(([candyType, target]) => {
                const current = progress.clearedCandies[candyType as CandyType] || 0;
                const isCompleted = current >= (target ?? 0);
                return (
                    <ObjectiveItem key={candyType} completed={isCompleted}>
                        <CandyIcon type={candyType as CandyType} />
                        Clear {target} ({current})
                    </ObjectiveItem>
                );
            })}
        </div>
    );
};