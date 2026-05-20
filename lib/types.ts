export interface SocialLink {
  platform: 'x' | 'instagram' | 'youtube' | 'twitch' | 'tiktok' | 'discord' | 'facebook';
  url: string;
}

export interface Sponsor {
  id: string;
  name: string;
  slug?: string;
  color: string;
  logo?: string;
}

export interface PlayerProfile {
  id: string;
  tag: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  socialLinks: SocialLink[];
}

export interface DivisionAchievement {
  title: string;
  event: string;
  year: string;
}

export interface DivisionMediaItem {
  id: string;
  type: 'image' | 'clip';
  title: string;
  url: string;
}

export interface MatchScheduleItem {
  id: string;
  opponent: string;
  competition: string;
  date: string;
  status: 'upcoming' | 'completed';
}

export interface Division {
  id: string;
  name: string;
  game: string;
  tagline: string;
  description: string;
  icon: string;
  teams: number;
  players: number;
  featured?: boolean;
  roster: PlayerProfile[];
  achievements: DivisionAchievement[];
  media: DivisionMediaItem[];
  schedule: MatchScheduleItem[];
}

export interface TournamentParticipant {
  id: string;
  name: string;
  type: 'team' | 'player';
  record?: string;
}

export interface TournamentStandingsEntry {
  rank: number;
  name: string;
  played: number;
  points: number;
}

export interface TournamentScheduleItem {
  id: string;
  label: string;
  stage: string;
  date: string;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  division: 'FCX';
  status: 'upcoming' | 'active' | 'past';
  overview: string;
  format: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  registrationOpen: boolean;
  image: string;
  participants: TournamentParticipant[];
  standings: TournamentStandingsEntry[];
  schedule: TournamentScheduleItem[];
  results: string[];
}

export interface Streamer {
  id: string;
  name: string;
  game: string;
  avatar: string;
  status: 'live' | 'offline';
  platform: 'twitch' | 'youtube';
  followers: number;
  bio: string;
  embedUrl: string;
  liveUrl: string;
  socialLinks: SocialLink[];
  highlights: string[];
  schedule: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: 'Announcements' | 'Results' | 'Tournaments' | 'Community';
  content: string[];
}
