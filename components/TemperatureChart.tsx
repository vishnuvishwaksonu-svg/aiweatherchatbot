import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherIcon, Humid, Rain } from './WeatherIcons';

interface ChartDataPoint {
  time: string;
  temp: number;
  condition: string;
  precip?: number;
  humidity?: number;
}

interface Props {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-slate-900/95 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[160px] animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
          <div className="bg-blue-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold text-blue-400 uppercase">Hourly</div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <WeatherIcon condition={data.condition} className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
          <div>
            <p className="text-2xl font-bold text-white leading-none tracking-tighter">{Math.round(data.temp)}°C</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">{data.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Humid className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-300">{data.humidity || 0}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Rain className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-300">{data.precip || 0}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TemperatureChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-48 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b', fontWeight: 600 }}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTemp)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;