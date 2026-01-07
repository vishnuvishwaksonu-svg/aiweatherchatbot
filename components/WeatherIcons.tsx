import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  rotation?: number;
}

export const Sun: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path className="animate-sun-spin" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
    <circle cx="12" cy="12" r="4" strokeWidth={2} />
  </svg>
);

export const ThermometerIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const LeafIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 110-18c1.32 0 2.58.26 3.73.74L19 2l-1.5 4.5c.32.48.6 1 .83 1.54M12 12l9 9m-9-9l-9 9" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const PartlyCloudy: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <defs>
      <linearGradient id="cloudSilver" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <g className="animate-float">
      <g className="animate-sun-pulse">
        <circle className="text-yellow-400" cx="16" cy="8" r="4" strokeWidth={2} />
        <path className="animate-sun-spin text-yellow-500" d="M16 2v1M20.5 4.5l-.7.7M23 8h-1" strokeWidth={1} strokeLinecap="round" />
      </g>
      
      {/* High Altitude Wispy Cloud */}
      <path 
        className="text-white/20 animate-cirrus-drift" 
        d="M2 12c4-2 8 2 12 0s8-2 12 0" 
        strokeWidth={1} 
        strokeLinecap="round"
      />

      {/* Main Backlit Cloud */}
      <path 
        className="animate-edge-shimmer text-blue-300/40" 
        d="M3 16a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 16z" 
        strokeWidth={2} 
        strokeLinecap="round" 
        fill="url(#cloudSilver)" 
      />
    </g>
  </svg>
);

export const Cloud: React.FC<IconProps & { variant?: 'cumulus' | 'overcast' | 'scattered' }> = ({ className = "w-6 h-6", variant = 'cumulus' }) => (
  <svg className={`${className} overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <g className="animate-float">
      {/* Background Soft Atmospheric Depth */}
      <circle cx="12" cy="14" r="9" className="text-blue-600/5 animate-pulse-slow" fill="currentColor" />
      
      {variant === 'scattered' && (
        <g className="animate-cirrus-drift opacity-40">
          <path d="M4 8c3-1 6 1 9 0" stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" />
          <path d="M14 6c3 1 6-1 9 0" stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" />
        </g>
      )}

      {/* Rear Drifting Layer */}
      <path 
        className="text-blue-400 opacity-20 animate-cloud-drift-slow" 
        d="M10 12a3 3 0 013 3h4a3 3 0 110 6H7a3 3 0 110-6h3z" 
        fill="currentColor" 
      />
      
      {/* Middle Formation Swell */}
      <g className="animate-cumulus-swell">
        <path 
          className="text-blue-400/40 opacity-50 animate-cloud-drift-fast" 
          d="M7 15a3 3 0 013-3h5a4 4 0 110 8H7a3 3 0 010-6z" 
          fill="currentColor" 
        />
        
        {/* Main Morphing Body */}
        <path 
          className={`${variant === 'overcast' ? 'text-slate-400' : 'text-blue-400'} animate-cloud-morph animate-edge-shimmer`} 
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
          strokeWidth={variant === 'overcast' ? 3 : 2}
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill={variant === 'overcast' ? 'rgba(71, 85, 105, 0.15)' : 'rgba(59, 130, 246, 0.1)'} 
        />
      </g>

      {variant === 'cumulus' && (
        <circle cx="12" cy="11" r="2.5" className="text-blue-300/30 animate-pulse-slow" fill="currentColor" />
      )}
    </g>
  </svg>
);

export const Rain: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path className="animate-float" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeWidth={2} />
    <path className="animate-rain-drop" d="M8 13v2M12 15v2M16 13v2" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const RainfallIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-blue-400 overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <g>
      {/* Main droplet body */}
      <path 
        d="M12 2.5C12 2.5 6 9 6 14.5C6 17.8137 8.68629 20.5 12 20.5C15.3137 20.5 18 17.8137 18 14.5C18 9 12 2.5 12 2.5Z" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      {/* Internal subtle glint */}
      <path 
        className="animate-pulse-slow"
        d="M10 12C10 12 9 13.5 9 15" 
        stroke="white" 
        strokeOpacity="0.4" 
        strokeWidth="1" 
        strokeLinecap="round"
      />
      {/* Falling drop particles */}
      <g className="animate-drop-subtle">
        <path d="M12 8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 14v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* Surface ripple */}
      <path 
        className="animate-ripple" 
        d="M8 22h8" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round" 
        opacity="0.3" 
      />
    </g>
  </svg>
);

export const Drizzle: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <g className="animate-float">
      <circle className="text-blue-400 animate-mist-pulse" cx="12" cy="15" r="7" fill="currentColor" />
      <path className="text-blue-300 opacity-60" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" />
      <g className="text-blue-200">
        <circle className="animate-drizzle-shimmer" style={{ animationDelay: '0s' }} cx="7" cy="13" r="0.5" fill="currentColor" />
        <circle className="animate-drizzle-shimmer" style={{ animationDelay: '0.4s' }} cx="11" cy="15" r="0.4" fill="currentColor" />
        <circle className="animate-drizzle-shimmer" style={{ animationDelay: '0.8s' }} cx="15" cy="14" r="0.5" fill="currentColor" />
        <circle className="animate-drizzle-shimmer" style={{ animationDelay: '1.2s' }} cx="9" cy="16" r="0.3" fill="currentColor" />
        <circle className="animate-drizzle-shimmer" style={{ animationDelay: '1.6s' }} cx="13" cy="13" r="0.4" fill="currentColor" />
      </g>
    </g>
  </svg>
);

export const Thunderstorm: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-slate-400 overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path 
      className="animate-storm-shake animate-cloud-flash text-slate-600" 
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
      strokeWidth={2} 
      fill="currentColor" 
    />
    <g className="text-blue-400">
      <path className="animate-rain-heavy" style={{ animationDelay: '0s' }} d="M6 16l-1 4" strokeWidth={1.5} strokeLinecap="round" />
      <path className="animate-rain-heavy" style={{ animationDelay: '0.1s' }} d="M9 17l-1 4" strokeWidth={1.5} strokeLinecap="round" />
      <path className="animate-rain-heavy" style={{ animationDelay: '0.3s' }} d="M12 18l-1 4" strokeWidth={1.5} strokeLinecap="round" />
      <path className="animate-rain-heavy" style={{ animationDelay: '0.2s' }} d="M15 17l-1 4" strokeWidth={1.5} strokeLinecap="round" />
      <path className="animate-rain-heavy" style={{ animationDelay: '0.4s' }} d="M18 16l-1 4" strokeWidth={1.5} strokeLinecap="round" />
    </g>
    <path 
      className="animate-lightning-impact text-yellow-400" 
      d="M13 10l-4 5h3l-1 6 5-7h-3l1-4z" 
      fill="currentColor" 
      stroke="white" 
      strokeWidth={0.5}
    />
    <circle 
      className="animate-lightning-impact text-yellow-500 opacity-20" 
      cx="12" cy="14" r="10" 
      fill="currentColor" 
    />
  </svg>
);

export const Snow: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} overflow-visible`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <g className="animate-float">
      {/* Heavy Snow Cloud with Edge Shimmer */}
      <path 
        className="text-blue-100 opacity-90 animate-edge-shimmer" 
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
        strokeWidth={2} 
        fill="rgba(241, 245, 249, 0.2)"
      />
      
      {/* Dynamic Swaying Snowflake Groups */}
      <g className="animate-sway-slow">
        {/* Layer 1: Foreground fast/large */}
        <circle className="animate-snow-l1 text-white" style={{ animationDelay: '0s' }} cx="6" cy="13" r="0.7" fill="currentColor" />
        <circle className="animate-snow-l1 text-white" style={{ animationDelay: '1.2s' }} cx="12" cy="12" r="0.8" fill="currentColor" />
        <circle className="animate-snow-l1 text-white" style={{ animationDelay: '2.5s' }} cx="18" cy="14" r="0.7" fill="currentColor" />
        
        {/* Layer 2: Midground rotating crystals */}
        <g className="animate-snow-l2 text-blue-50 opacity-80">
          <path style={{ animationDelay: '0.5s' }} d="M9 15.5l1 1M10 15.5l-1 1" stroke="currentColor" strokeWidth="0.5" />
          <path style={{ animationDelay: '1.8s' }} d="M14 16.5l1 1M15 16.5l-1 1" stroke="currentColor" strokeWidth="0.5" />
          <circle style={{ animationDelay: '3.2s' }} cx="8" cy="17" r="0.5" fill="currentColor" />
        </g>

        {/* Layer 3: Background slow atmospheric drift */}
        <g className="animate-snow-l3 text-white/40">
          <circle style={{ animationDelay: '0.2s' }} cx="15" cy="13" r="0.4" fill="currentColor" />
          <circle style={{ animationDelay: '2.1s' }} cx="10" cy="14" r="0.3" fill="currentColor" />
          <circle style={{ animationDelay: '4.0s' }} cx="16" cy="16" r="0.4" fill="currentColor" />
          <circle style={{ animationDelay: '5.5s' }} cx="5" cy="15" r="0.3" fill="currentColor" />
        </g>
      </g>
    </g>
  </svg>
);

export const Wind: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-slate-300 animate-cloud-drift`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

export const Foggy: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle className="animate-fog-pulse text-slate-400" cx="12" cy="12" r="9" fill="currentColor" />
    <path className="animate-fog-layered-1" d="M5 8h10" strokeWidth={1.5} strokeLinecap="round" />
    <path className="animate-fog-layered-2" style={{ animationDelay: '-1s' }} d="M3 11h18" strokeWidth={2.5} strokeLinecap="round" />
    <path className="animate-fog-layered-3" style={{ animationDelay: '-2s' }} d="M7 14h12" strokeWidth={1.5} strokeLinecap="round" />
    <path className="animate-fog-layered-1" style={{ animationDelay: '-3.5s' }} d="M4 17h14" strokeWidth={2} strokeLinecap="round" />
    <path className="animate-fog-layered-2" style={{ animationDelay: '-5s' }} d="M8 20h8" strokeWidth={1} strokeLinecap="round" />
  </svg>
);

export const Humid: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

export const PressureIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
  </svg>
);

export const CompassIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style, rotation = 0 }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth={1.5} className="opacity-20" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18M3 12h18" className="opacity-5" />
    <g className="animate-needle-float" style={{ transformOrigin: 'center', transform: `rotate(${rotation}deg)` }}>
      <path d="M12 4l-3 8 3 8 3-8-3-8z" fill="currentColor" className="text-blue-500/80" />
      <path d="M12 4l-3 8h6l-3-8z" fill="currentColor" className="text-red-500" />
    </g>
  </svg>
);

export const WindArrow: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19V5m0 0l-7 7m7-7l7 7" />
  </svg>
);

export const VectorIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className }) => {
  const c = (condition || '').toLowerCase();
  
  if (c.includes('thunderstorm') || c.includes('storm') || c.includes('lightning')) return <Thunderstorm className={className} />;
  if (c.includes('drizzle') || c.includes('misty rain') || c.includes('light rain')) return <Drizzle className={className} />;
  if (c.includes('rain') || c.includes('shower')) return <Rain className={className} />;
  if (c.includes('snow') || c.includes('sleet') || c.includes('hail')) return <Snow className={className} />;
  if (c.includes('partly cloudy') || c.includes('scattered clouds')) return <Cloud variant="scattered" className={className} />;
  if (c.includes('overcast')) return <Cloud variant="overcast" className={className} />;
  if (c.includes('cloud')) return <Cloud variant="cumulus" className={className} />;
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return <Foggy className={className} />;
  if (c.includes('sun') || c.includes('clear')) return <Sun className={className} />;
  if (c.includes('wind') || c.includes('gale')) return <Wind className={className} />;
  
  return <Cloud className={className} />;
};