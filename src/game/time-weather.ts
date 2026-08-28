// Time, weather, and season system
import { Season, Weather, TimePeriod } from './types';

export function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'evening';
  if (hour >= 19 && hour < 21) return 'dusk';
  return 'night';
}

export function getSeasonFromDay(dayCount: number): Season {
  const cycle = dayCount % 120; // 120 game days = full year
  if (cycle < 30) return 'spring';
  if (cycle < 60) return 'summer';
  if (cycle < 90) return 'autumn';
  return 'winter';
}

export function rollWeather(season: Season, currentWeather: Weather): Weather {
  const rand = Math.random();
  
  const weights: Record<Season, Record<Weather, number>> = {
    spring: { clear: 0.4, cloudy: 0.3, rain: 0.25, snow: 0, fog: 0.05 },
    summer: { clear: 0.65, cloudy: 0.2, rain: 0.1, snow: 0, fog: 0.05 },
    autumn: { clear: 0.3, cloudy: 0.3, rain: 0.25, snow: 0.05, fog: 0.1 },
    winter: { clear: 0.25, cloudy: 0.25, rain: 0.15, snow: 0.25, fog: 0.1 },
  };

  const w = weights[season];
  let cumulative = 0;
  for (const [weather, weight] of Object.entries(w)) {
    cumulative += weight;
    if (rand < cumulative) return weather as Weather;
  }
  return 'clear';
}

export interface SkyColors {
  sky: string[];
  sun: string;
  sunY: number;
  starOpacity: number;
  ambientLight: number; // 0-1
}

export function getSkyColors(hour: number, season: Season, weather: Weather): SkyColors {
  const period = getTimePeriod(hour);
  
  const weatherDim = weather === 'rain' ? 0.6 : weather === 'snow' ? 0.7 : weather === 'cloudy' ? 0.8 : weather === 'fog' ? 0.65 : 1;
  
  const seasonTint: Record<Season, { warm: number; sat: number }> = {
    spring: { warm: 0, sat: 1 },
    summer: { warm: 10, sat: 1.1 },
    autumn: { warm: 20, sat: 0.85 },
    winter: { warm: -10, sat: 0.7 },
  };
  const st = seasonTint[season];

  switch (period) {
    case 'dawn':
      return { sky: [`hsl(${30 + st.warm}, ${55 * st.sat}%, ${60 * weatherDim}%)`, `hsl(${40 + st.warm}, ${50 * st.sat}%, ${70 * weatherDim}%)`, `hsl(${200 + st.warm}, ${45 * st.sat}%, ${75 * weatherDim}%)`], sun: '#FFD700', sunY: 58, starOpacity: 0.05, ambientLight: 0.4 };
    case 'morning':
      return { sky: [`hsl(${200 + st.warm}, ${55 * st.sat}%, ${78 * weatherDim}%)`, `hsl(${210 + st.warm}, ${50 * st.sat}%, ${82 * weatherDim}%)`, `hsl(${35 + st.warm}, ${45 * st.sat}%, ${82 * weatherDim}%)`], sun: '#FFF3B0', sunY: 25, starOpacity: 0, ambientLight: 0.8 };
    case 'afternoon':
      return { sky: [`hsl(${205 + st.warm}, ${60 * st.sat}%, ${75 * weatherDim}%)`, `hsl(${210 + st.warm}, ${55 * st.sat}%, ${80 * weatherDim}%)`, `hsl(${40 + st.warm}, ${40 * st.sat}%, ${80 * weatherDim}%)`], sun: '#FFFACD', sunY: 20, starOpacity: 0, ambientLight: 1 };
    case 'evening':
      return { sky: [`hsl(${15 + st.warm}, ${60 * st.sat}%, ${55 * weatherDim}%)`, `hsl(${30 + st.warm}, ${55 * st.sat}%, ${65 * weatherDim}%)`, `hsl(${200 + st.warm}, ${45 * st.sat}%, ${60 * weatherDim}%)`], sun: '#FF8030', sunY: 50, starOpacity: 0.1, ambientLight: 0.5 };
    case 'dusk':
      return { sky: [`hsl(${220 + st.warm}, ${40 * st.sat}%, ${30 * weatherDim}%)`, `hsl(${240 + st.warm}, ${35 * st.sat}%, ${40 * weatherDim}%)`, `hsl(${20 + st.warm}, ${50 * st.sat}%, ${45 * weatherDim}%)`], sun: '#FFA040', sunY: 62, starOpacity: 0.3, ambientLight: 0.3 };
    case 'night':
    default:
      return { sky: [`hsl(${220 + st.warm}, ${30 * st.sat}%, ${8 * weatherDim}%)`, `hsl(${225 + st.warm}, ${25 * st.sat}%, ${12 * weatherDim}%)`, `hsl(${230 + st.warm}, ${20 * st.sat}%, ${18 * weatherDim}%)`], sun: '#ccccaa', sunY: 70, starOpacity: 0.6, ambientLight: 0.1 };
  }
}
