import React from 'react';

interface WindSpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
}

const WindSpeedGauge: React.FC<WindSpeedGaugeProps> = ({ speed, maxSpeed = 100 }) => {
  const percentage = Math.min((speed / maxSpeed) * 100, 100);
  
  // Calculate pulse duration: 0 km/h = 3s, 100 km/h = 0.5s
  const pulseDuration = Math.max(0.4, 3 - (speed / maxSpeed) * 2.6);
  
  // SVG path for a semi-circle gauge
  const radius = 16;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className="relative flex flex-col items-center mt-2 w-full max-w-[80px]"
      style={{ '--pulse-duration': `${pulseDuration}s` } as React.CSSProperties}
    >
      <div className={speed > 5 ? "animate-wind-pulse" : ""}>
        <svg viewBox="0 0 40 22" className="w-full drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
          <defs>
            <linearGradient id="windGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <path
            d="M 4 20 A 16 16 0 0 1 36 20"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Progress Bar */}
          <path
            d="M 4 20 A 16 16 0 0 1 36 20"
            fill="none"
            stroke="url(#windGaugeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
      </div>
      {/* Indicator dots or labels */}
      <div className="flex justify-between w-full mt-1 px-1">
        <span className="text-[7px] text-slate-600 font-bold">0</span>
        <span className="text-[7px] text-slate-600 font-bold">{maxSpeed}</span>
      </div>
    </div>
  );
};

export default WindSpeedGauge;