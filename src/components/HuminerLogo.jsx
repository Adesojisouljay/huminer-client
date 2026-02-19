import React from 'react';

const HuminerLogo = ({ width = 40, height = 40, className = '' }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Stylized 'H' / Mining Pickaxe Shape */}
        <path
            d="M20 20 L20 80 L35 80 L35 55 L65 55 L65 80 L80 80 L80 20 L65 20 L65 40 L35 40 L35 20 Z"
            fill="url(#goldGradient)"
            filter="url(#glow)"
        />

        {/* Diamond Gem in center */}
        <path
            d="M50 30 L60 40 L50 55 L40 40 Z"
            fill="#fff"
            opacity="0.9"
        />
    </svg>
);

export default HuminerLogo;
