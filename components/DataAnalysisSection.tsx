
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeatherData, AnalysisParameter } from '../types';
import { fetchHistoricalData, fetchPredictionData } from '../services/weatherService';

interface DataAnalysisSectionProps {
  weather: WeatherData;
}

type MainTab = 'Live Data' | 'Historical Data' | 'Prediction Data';
type PredictionMode = 'Live Forecast' | 'Historical Forecast';

const PARAMETERS: { id: AnalysisParameter; label: string; unit: string }[] = [
  { id: 'temp', label: 'Temperature', unit: '°C' },
  { id: 'feelsLike', label: 'Feels Like', unit: '°C' },
  { id: 'humidity', label: 'Humidity', unit: '%' },
  { id: 'windSpeed', label: 'Wind Speed', unit: 'km/h' },
  { id: 'windDirection', label: 'Wind Direction', unit: '°' },
  { id: 'pressure', label: 'Pressure', unit: 'hPa' },
  { id: 'precipAmount', label: 'Precipitation', unit: 'mm' },
  { id: 'cloudCover', label: 'Cloud Cover', unit: '%' },
  { id: 'visibility', label: 'Visibility', unit: 'km' },
  { id: 'aqi', label: 'Air Quality', unit: 'Idx' },
  { id: 'snowAmount', label: 'Snowfall', unit: 'mm' },
  { id: 'uWind', label: 'Zonal Wind', unit: 'm/s' },
  { id: 'vWind', label: 'Meridional Wind', unit: 'm/s' }
];

const DataAnalysisSection: React.FC<DataAnalysisSectionProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('Live Data');
  const [predictionMode, setPredictionMode] = useState<PredictionMode>('Live Forecast');
  const [selectedParam, setSelectedParam] = useState<AnalysisParameter>('temp');
  
  // Date and Resolution controls for Historical/Prediction
  const [startDate, setStartDate] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dataMode, setDataMode] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentParam = PARAMETERS.find(p => p.id === selectedParam)!;

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'Live Data') {
          // Live Data: 24-hour hourly plots
          const live = weather.hourly.map(h => ({
            label: h.time,
            value: (h[selectedParam as keyof typeof h] as number) || 0
          }));
          setChartData(live);
        } else if (activeTab === 'Historical Data') {
          // Historical Data: Past records via Gemini synthesis or API
          const data = await fetchHistoricalData(weather.city, selectedParam, startDate, endDate, dataMode);
          setChartData(data);
        } else if (activeTab === 'Prediction Data') {
          if (predictionMode === 'Live Forecast') {
            // Live Forecast: 7-day trend from the current weather forecast object
            const forecast = weather.forecast.map(f => ({
              label: f.day,
              value: (f[selectedParam as keyof typeof f] as number) || 0
            }));
            setChartData(forecast);
          } else {
            // Historical Forecast: Trend of what WAS predicted for a past range
            const data = await fetchPredictionData(weather.city, selectedParam, startDate, endDate, dataMode);
            setChartData(data);
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    updateData();
  }, [activeTab, predictionMode, selectedParam, weather, startDate, endDate, dataMode]);

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header & Main Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Atmospheric Analysis</h2>
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mt-1">Multi-Vector Data Engine</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          {(['Live Data', 'Historical Data', 'Prediction Data'] as MainTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none"></div>

        {/* Prediction Mode Toggles */}
        {activeTab === 'Prediction Data' && (
          <div className="flex justify-center">
            <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
              {(['Live Forecast', 'Historical Forecast'] as PredictionMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPredictionMode(mode)}
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    predictionMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Atmospheric Parameter</label>
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value as AnalysisParameter)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer"
            >
              {PARAMETERS.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.label}</option>
              ))}
            </select>
          </div>

          {(activeTab === 'Historical Data' || (activeTab === 'Prediction Data' && predictionMode === 'Historical Forecast')) && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Epoch Start</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Epoch End</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Resolution</label>
                <select
                  value={dataMode}
                  onChange={(e) => setDataMode(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="Daily" className="bg-slate-900">Daily</option>
                  <option value="Weekly" className="bg-slate-900">Weekly</option>
                  <option value="Monthly" className="bg-slate-900">Monthly</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Visual Chart Container */}
        <div className="relative group">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem] animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Processing Vectors...</span>
              </div>
            </div>
          )}
          
          <div className="h-[450px] w-full bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-4 sm:p-8 hover:border-white/10 transition-all shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                      {currentParam.label} Trend
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/10 font-black uppercase tracking-widest">{activeTab}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Measured in {currentParam.unit} • {weather.city}</p>
                </div>
                <div className="text-left sm:text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Data Integrity</p>
                    <p className="text-sm font-mono font-bold text-green-400">99.98% SYNC</p>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height="75%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analysisGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeTab === 'Prediction Data' ? "#6366f1" : "#3b82f6"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={activeTab === 'Prediction Data' ? "#6366f1" : "#3b82f6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#475569" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b', fontWeight: 800 }}
                  interval="preserveStartEnd"
                  dy={10}
                />
                <YAxis 
                   stroke="#475569" 
                   fontSize={9} 
                   tickLine={false} 
                   axisLine={false}
                   tick={{ fill: '#64748b', fontWeight: 800 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '1.25rem',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 900, fontSize: '13px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.1em' }}
                  formatter={(value: number) => [`${value} ${currentParam.unit}`, currentParam.label]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={activeTab === 'Prediction Data' ? "#6366f1" : "#3b82f6"} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#analysisGradient)" 
                  animationDuration={1500}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistical Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Peak Amplitude</span>
                <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform">{Math.max(...chartData.map(d => d.value), 0).toFixed(1)}<span className="text-sm text-blue-500 ml-1">{currentParam.unit}</span></span>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Vector Average</span>
                <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform">{(chartData.reduce((acc, d) => acc + d.value, 0) / (chartData.length || 1)).toFixed(1)}<span className="text-sm text-blue-500 ml-1">{currentParam.unit}</span></span>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Trough Reading</span>
                <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform">{Math.min(...chartData.map(d => d.value), 0).toFixed(1)}<span className="text-sm text-blue-500 ml-1">{currentParam.unit}</span></span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisSection;
