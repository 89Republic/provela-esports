export interface SocialLink {
  platform: 'x' | 'instagram' | 'youtube' | 'twitch' | 'tiktok' | 'discord' | 'facebook';
  url: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}

export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  socialLinks: SocialLink[];
  order: number;
}

export interface FeaturedMatch {
  teamA: string;
  teamB: string;
  division: string;
  when: string;
  streamUrl: string;
  enabled: boolean;
}

export interface CommunityStat {
  label: string;
  value: number;
  suffix?: string;
}

export interface CommunityPulseContent {
  eyebrow: string;
  titleLines: string[];
  stats: CommunityStat[];
  feed: string[];
  ctaLabel: string;
  ctaHref: string;
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
  /** Number of team slots. Slots left = capacity − registered participants. Unset for invitationals. */
  capacity?: number;
  image: string;
  participants: TournamentParticipant[];
  standings: TournamentStandingsEntry[];
  schedule: TournamentScheduleItem[];
  results: string[];
}

export const STREAMER_PLATFORMS = [
  'youtube',
  'twitch',
  'tiktok',
  'kick',
  'facebook',
  'discord',
  'instagram',
] as const;

export type StreamerPlatform = (typeof STREAMER_PLATFORMS)[number];

export interface Streamer {
  id: string;
  name: string;
  game: string;
  avatar: string;
  status: 'live' | 'offline';
  platform: StreamerPlatform;
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
  published: boolean;
}
