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
