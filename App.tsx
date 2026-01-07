
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherData, ForecastDay, HourlyForecast, AnalysisParameter } from './types';
import { fetchWeather, fetchHistoricalData, fetchPredictionData } from './services/weatherService';
import { 
  WeatherIcon, Sun, Humid, Wind, PressureIcon, CompassIcon, 
  VectorIcon, Rain, Snow, WindArrow, Drizzle, Thunderstorm, 
  Cloud, LeafIcon, EyeIcon, AlertIcon, ThermometerIcon, RainfallIcon
} from './components/WeatherIcons';
import ChatInterface from './components/ChatInterface';
import TemperatureChart from './components/TemperatureChart';
import WindSpeedGauge from './components/WindSpeedGauge';
import DataAnalysisSection from './components/DataAnalysisSection';

const LAST_CITY_KEY = 'skycast_last_city';
const SYNC_INTERVAL_MS = 15 * 60 * 1000;

type ViewMode = 'overview' | 'daily' | 'hourly' | 'analysis';

const DashboardSection = ({ icon: Icon, title, value, subValue, highlight = false, special = false }: { icon: any, title: string, value: string | number, subValue?: string, highlight?: boolean, special?: boolean }) => (
  <div className={`flex flex-col items-center justify-center text-center p-5 rounded-[2rem] border transition-all group backdrop-blur-md ${
    highlight ? 'bg-blue-600/10 border-blue-500/30' : 
    special ? 'bg-indigo-600/10 border-indigo-500/30' :
    'bg-white/5 border-white/10 hover:border-white/20'
  }`}>
    <div className={`p-3 rounded-2xl mb-2 transition-transform group-hover:scale-110 ${
      highlight ? 'bg-blue-500/20' : 
      special ? 'bg-indigo-500/20' : 
      'bg-white/5'
    }`}>
      <Icon className={`w-6 h-6 ${highlight ? 'text-blue-400' : special ? 'text-indigo-400' : 'text-slate-400'}`} />
    </div>
    <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-1">{title}</span>
    <span className="text-lg font-bold text-white truncate w-full">{value ?? 'N/A'}</span>
    {subValue && <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{subValue}</p>}
  </div>
);

const ParameterModal: React.FC<{ title: string; data: any; onClose: () => void }> = ({ title, data, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Atmospheric Detail</h3>
            <h2 className="text-3xl font-black text-white tracking-tighter">{title}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <DashboardSection icon={() => <WeatherIcon condition={data.condition} />} title="Condition" value={data.condition} subValue="Status" highlight />
          <DashboardSection icon={ThermometerIcon} title="Temperature" value={`${Math.round(data.temp || data.high)}°C`} subValue="Thermal" />
          <DashboardSection icon={Humid} title="Humidity" value={`${data.humidity}%`} subValue="Vapor" />
          <DashboardSection icon={PressureIcon} title="Pressure" value={`${data.pressure} hPa`} subValue="Surface" />
          <DashboardSection icon={RainfallIcon} title="Precipitation" value={`${data.precipAmount || 0} mm`} subValue="Liquid" highlight />
          <DashboardSection icon={Cloud} title="Cloud Cover" value={`${data.cloudCover}%`} subValue="Coverage" />
          <DashboardSection icon={EyeIcon} title="Visibility" value={`${data.visibility} km`} subValue="Sight" />
          <DashboardSection icon={LeafIcon} title="Air Quality" value={data.aqi} subValue="AQI" special />
          <DashboardSection icon={Thunderstorm} title="Thunderstorm" value={data.thunderstorm || 'None'} subValue="Risk" special />
        </div>
        
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all shadow-xl shadow-blue-600/20 active:scale-95">
            Dismiss Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'info' | 'success'} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('overview' as ViewMode);
  const [selectedItem, setSelectedItem] = useState<ForecastDay | HourlyForecast | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem(LAST_CITY_KEY) || 'Bellary');

  const syncTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatLocalTime = () => {
    if (!weather?.timezone) return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: weather.timezone, hour12: true
      }).format(currentTime);
    } catch {
      return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const loadWeather = useCallback(async (targetCity: string, isAutoSync = false) => {
    if (!targetCity || typeof targetCity !== 'string' || !targetCity.trim()) return;
    setIsSyncing(true);
    if (!isAutoSync) setNotification({ message: 'Syncing Atmosphere...', type: 'info' });
    try {
      const data = await fetchWeather(targetCity);
      setWeather(data);
      setSearchQuery(data.city);
      localStorage.setItem(LAST_CITY_KEY, data.city);
      if (!isAutoSync) setNotification({ message: 'Vector Sync Complete', type: 'success' });
    } catch {
      setNotification({ message: 'Atmospheric Interruption', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const currentCity = localStorage.getItem(LAST_CITY_KEY) || 'Bellary';
    loadWeather(currentCity);
    syncTimerRef.current = window.setInterval(() => loadWeather(currentCity, true), SYNC_INTERVAL_MS);
    return () => { if (syncTimerRef.current) clearInterval(syncTimerRef.current); };
  }, [loadWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) loadWeather(searchQuery);
  };

  const handleChatCityUpdate = (city: string) => loadWeather(city);

  return (
    <div className="min-h-screen weather-gradient text-slate-200 selection:bg-blue-500/30 pb-20">
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl border backdrop-blur-xl animate-fade-in-up flex items-center gap-3 shadow-2xl bg-white/10 border-white/20">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <button className="flex items-center gap-3 group transition-all" onClick={() => { setViewMode('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="bg-blue-600 p-2 rounded-xl shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform"><Sun className="w-6 h-6 text-white" /></div>
                <h1 className="text-2xl font-bold tracking-tight text-white">SkyCast AI</h1>
              </button>
              {weather && (
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hidden sm:flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase text-blue-400 tracking-[0.2em]">Local Time</span>
                  <span className="text-sm font-mono font-bold text-white">{formatLocalTime()}</span>
                </div>
              )}
            </div>
            <form onSubmit={handleSearch} className="w-full md:w-80 relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search city..." className="w-full bg-white/5 rounded-full py-2.5 px-6 pr-12 focus:outline-none border border-white/10 text-sm" />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
            </form>
          </div>
          {weather && (
            <nav className="flex flex-wrap justify-center md:justify-start gap-1.5">
              <button onClick={() => setViewMode('overview')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${viewMode === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>Overview</button>
              <button onClick={() => setViewMode('daily')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${viewMode === 'daily' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>Daily</button>
              <button onClick={() => setViewMode('hourly')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${viewMode === 'hourly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>Hourly</button>
              <button onClick={() => setViewMode('analysis')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${viewMode === 'analysis' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>Data Analysis</button>
            </nav>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {weather && (
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            <div className="flex-1 space-y-12 w-full">
              {viewMode === 'overview' && (
                <>
                  <div className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl animate-fade-in-up">
                    <div className="relative z-10 space-y-10">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">{weather.city}</h2>
                            <div className="bg-blue-500/20 text-blue-400 text-[9px] px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-[0.2em] font-black">Live</div>
                          </div>
                          <p className="text-2xl text-slate-400 capitalize font-medium mb-8">{weather.description}</p>
                          <div className="flex items-center gap-6 mb-12">
                            <div className="text-8xl md:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                                {Math.round(weather.temp)}<span className="text-blue-500 opacity-60">°</span>
                            </div>
                            <div className="flex flex-col items-start">
                              <WeatherIcon condition={weather.condition} className="w-20 h-20 text-blue-400 mb-2 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                              <span className="text-3xl font-bold text-slate-200 uppercase tracking-wide">{weather.condition}</span>
                            </div>
                          </div>
                          
                          {weather.alerts && weather.alerts.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-3xl flex items-start gap-4 animate-pulse mb-8">
                              <AlertIcon className="w-6 h-6 text-red-500 mt-1" />
                              <div>
                                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Atmospheric Warning</h4>
                                <p className="text-sm font-medium text-white">{weather.alerts[0]}</p>
                              </div>
                            </div>
                          )}

                          <div className="pt-8 border-t border-white/5">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Temperature Trend</h4>
                            <TemperatureChart data={weather.hourly.slice(0, 8)} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4 w-full lg:max-w-[500px]">
                          <DashboardSection icon={ThermometerIcon} title="Temperature" value={`${Math.round(weather.temp)}°C`} subValue={`High: ${Math.round(weather.high)}°`} highlight />
                          <DashboardSection icon={Sun} title="Feels Like" value={`${Math.round(weather.feelsLike)}°C`} subValue="Impact Temp" />
                          <DashboardSection icon={Humid} title="Humidity" value={`${weather.humidity}%`} subValue="Moisture" />
                          <div className="col-span-1 p-4 rounded-[2rem] border bg-white/5 border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                            <Wind className="w-6 h-6 text-blue-400 mb-1" />
                            <span className="text-[8px] font-black uppercase text-slate-500">Wind Velocity</span>
                            <span className="text-lg font-bold">{weather.windSpeed} km/h</span>
                            <WindSpeedGauge speed={weather.windSpeed} />
                          </div>
                          <DashboardSection icon={(props: any) => <CompassIcon {...props} rotation={weather.windDirection} />} title="Wind Dir" value={`${weather.windDirection}°`} />
                          <DashboardSection icon={PressureIcon} title="Atm. Pressure" value={`${weather.pressure} hPa`} />
                          <DashboardSection icon={RainfallIcon} title="Precipitation" value={`${weather.precipAmount} mm`} highlight />
                          <DashboardSection icon={Cloud} title="Cloud Cover" value={`${weather.cloudCover}%`} />
                          <DashboardSection icon={EyeIcon} title="Visibility" value={`${weather.visibility} km`} />
                          <DashboardSection icon={Thunderstorm} title="Thunderstorm" value={weather.thunderstorm || 'None'} special />
                          <DashboardSection icon={LeafIcon} title="Air Quality" value={weather.aqi} special />
                          <DashboardSection icon={Snow} title="Snowfall" value={`${weather.snowAmount} mm`} highlight />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'daily' && (
                <div className="animate-fade-in space-y-6">
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-8">7-Day Matrix</h2>
                  {weather.forecast.map((item, idx) => (
                    <div key={idx} onClick={() => setSelectedItem(item)} className="glass rounded-[3rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-10 group cursor-pointer hover:border-blue-500/20 transition-all">
                      <div className="flex flex-col items-center min-w-[120px]">
                        <span className="text-slate-500 font-black uppercase tracking-widest text-xs mb-2">{item.day}</span>
                        <WeatherIcon condition={item.condition} className="w-12 h-12 text-blue-400 mb-2" />
                        <span className="text-3xl font-black text-white">{Math.round(item.high)}°</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4">
                        <DashboardSection icon={Humid} title="Humidity" value={`${item.humidity}%`} />
                        <DashboardSection icon={PressureIcon} title="Pressure" value={item.pressure} />
                        <DashboardSection icon={RainfallIcon} title="Rain" value={`${item.precipAmount}mm`} highlight />
                        <DashboardSection icon={Cloud} title="Cloud" value={`${item.cloudCover}%`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'hourly' && (
                <div className="animate-fade-in space-y-6">
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-8">24-Hour Timeline</h2>
                  {weather.hourly.map((item, idx) => (
                    <div key={idx} className="glass rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-10 border border-white/5">
                      <div className="min-w-[100px] text-center font-black text-slate-400 uppercase tracking-widest">{item.time}</div>
                      <WeatherIcon condition={item.condition} className="w-10 h-10 text-blue-400" />
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div><span className="text-[10px] text-slate-500 uppercase font-black block">Temp</span><span className="font-black text-xl text-white">{Math.round(item.temp)}°C</span></div>
                        <div><span className="text-[10px] text-slate-500 uppercase font-black block">Clouds</span><span className="font-bold text-slate-300">{item.cloudCover}%</span></div>
                        <div><span className="text-[10px] text-slate-500 uppercase font-black block">Precip</span><span className="font-bold text-blue-400">{item.precipAmount}mm</span></div>
                        <div><span className="text-[10px] text-slate-500 uppercase font-black block">AQI</span><span className="font-bold text-green-400">{item.aqi}</span></div>
                        <div className="truncate"><span className="text-[10px] text-slate-500 uppercase font-black block">Storm</span><span className="font-bold text-yellow-400">{item.thunderstorm}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'analysis' && (
                <DataAnalysisSection weather={weather} />
              )}
            </div>

            <div className="w-full xl:w-[450px] xl:sticky xl:top-32">
              <ChatInterface weather={weather} onCityUpdate={handleChatCityUpdate} />
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <ParameterModal 
          title={'day' in selectedItem ? (selectedItem as ForecastDay).day : (selectedItem as HourlyForecast).time} 
          data={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default App;
