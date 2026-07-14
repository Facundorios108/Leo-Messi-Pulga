export interface PlayerProfile {
  name: string;
  fullName: string;
  birthDate: string;
  birthPlace: string;
  height: string;
  positions: string[];
  currentTeam: string;
  imageUrl?: string;
}

export interface CareerTotals {
  appearances: number;
  goals: number;
  assists: number;
  titles: number;
}

export interface DetailedStatBreakdown {
  career: number;
  barca: number;
  psg: number;
  miami: number;
  argentina: number;
}

export interface DetailedStats {
  freeKicks: DetailedStatBreakdown;
  penalties: DetailedStatBreakdown;
  hatTricks: DetailedStatBreakdown;
  motm: DetailedStatBreakdown;
}

export interface SeasonStats {
  season: string;
  team: string;
  competition: string;
  appearances: number;
  goals: number;
  assists: number;
}

export interface Trophy {
  id: string;
  title: string;
  count: number;
  years: number[];
  category: 'club' | 'national' | 'individual';
  team: string;
  description: string;
}

export interface Milestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'club' | 'national' | 'personal';
  team?: string;
}

export interface RecordItem {
  id: string;
  title: string;
  description: string;
  scope: 'world' | 'europe' | 'club' | 'country';
  value: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation: string;
}

export interface CareerTotalsContainer {
  career: CareerTotals;
  clubs: {
    "FC Barcelona": { appearances: number; goals: number; assists: number };
    "Paris Saint-Germain": { appearances: number; goals: number; assists: number };
    "Inter Miami CF": { appearances: number; goals: number; assists: number };
    [key: string]: { appearances: number; goals: number; assists: number };
  };
  internationalBreakdown: {
    "FIFA World Cup": { appearances: number; goals: number; assists: number };
    "Copa América": { appearances: number; goals: number; assists: number };
    "FIFA World Cup Qualifiers": { appearances: number; goals: number; assists: number };
    "Finalissima": { appearances: number; goals: number; assists: number };
    "International Friendlies": { appearances: number; goals: number; assists: number };
    [key: string]: { appearances: number; goals: number; assists: number };
  };
  internationalYearly: { year: number; appearances: number; goals: number; assists: number }[];
  detailed?: DetailedStats;
}

export interface VideoItem {
  id: string;
  title: string;
  date: string;
  category: string;
  youtubeId: string;
  duration: string;
  description: string;
  ratingSum: number;
  ratingCount: number;
  stats?: {
    distanceYards?: number;
    defendersBeaten?: number;
    maxSpeedKmph?: number;
  };
}
