
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface RainfallTrendChartProps {
  data: { precipAmount: number }[];
}

const RainfallTrendChart: React.FC<RainfallTrendChartProps> = ({ data }) => {
  return (
    <div className="h-10 w-full mt-2 opacity-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 'auto']} />
          <Area 
            type="monotone" 
            dataKey="precipAmount" 
            stroke="#60a5fa" 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#rainGradient)"
            isAnimationActive={true}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainfallTrendChart;
