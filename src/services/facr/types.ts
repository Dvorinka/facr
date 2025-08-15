// Search result types
export interface SearchResult {
  name: string;
  club_id: string;
  club_type: 'football' | 'futsal';
  url: string;
  logo_url: string;
  category?: string;
  address?: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

// Match types
export interface Match {
  date_time: string;
  home: string;
  home_id: string;
  home_logo_url: string;
  away: string;
  away_id: string;
  away_logo_url: string;
  score: string;
  venue: string;
  match_id: string;
  report_url: string;
}

// Table row types
export interface TableRow {
  rank: string;
  team: string;
  team_id: string;
  team_logo_url: string;
  played: string;
  wins: string;
  draws: string;
  losses: string;
  score: string;
  points: string;
}

// Competition types
export interface Competition {
  id: string;
  code: string;
  name: string;
  team_count: string;
  matches_link: string;
  matches?: Match[];
  table?: {
    overall: TableRow[];
  };
}

// Club info response
export interface ClubInfo {
  name: string;
  club_id: string;
  club_type: 'football' | 'futsal';
  club_internal_id: string;
  url: string;
  logo_url: string;
  address: string;
  category: string;
  competitions: Competition[];
}

// Alias for backward compatibility
export type ClubSearchResult = SearchResult;
export type ClubSearchResponse = SearchResponse;
export type ClubMatch = Match;
export type ClubCompetition = Competition;
export type ClubResponse = ClubInfo;
export type TeamStanding = TableRow;
export type CompetitionTable = { overall: TableRow[] };
export type ClubTableCompetition = Competition & { table: CompetitionTable };
