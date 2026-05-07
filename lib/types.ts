export interface Player {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats?: {
    wins: number;
    losses: number;
    winRate: number;
  };
}

export interface Division {
  id: string;
  name: string;
  game: string;
  description: string;
  icon: string;
  teams: number;
  players: number;
  featured?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  prizePool: string;
  participants: number;
  image: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export interface Streamer {
  id: string;
  name: string;
  game: string;
  avatar: string;
  followers: number;
  twitchUrl: string;
  youtubeUrl?: string;
  status: 'live' | 'offline';
}
