export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;
export const CANDY_TYPES = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] as const;
export const INITIAL_MOVES = 30;
export const SCORE_PER_CANDY = 10;

export const CANDY_COLORS: { [key: string]: string } = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-600',
};

export const CANDY_SHADOWS: { [key: string]: string } = {
    red: 'shadow-[0_0_10px_#ef4444]',
    orange: 'shadow-[0_0_10px_#f97316]',
    yellow: 'shadow-[0_0_10px_#eab308]',
    green: 'shadow-[0_0_10px_#22c55e]',
    blue: 'shadow-[0_0_10px_#3b82f6]',
    purple: 'shadow-[0_0_10px_#9333ea]',
};