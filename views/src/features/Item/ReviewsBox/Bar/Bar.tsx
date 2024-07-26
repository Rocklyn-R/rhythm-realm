import React from 'react';

interface BarProps {
    percentage: number
}

export const Bar: React.FC<BarProps> = ({ percentage }) => {
    return (
        <div className="w-40 h-6 border border-gray-300">
            <div
                className="h-full bg-red-700 transition-width duration-300 ease-in-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};