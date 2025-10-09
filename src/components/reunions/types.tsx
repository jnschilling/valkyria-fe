// src/components/reunions/types.ts (New Shared Types File)
export interface RaceDetail {
  meeting_timestamp: number;
  reunion_label: string;
  race_label: string;
  start_time_in_s: number;
  race_status: string;
  race_name: string;
  race_is_quinte: boolean;
  race_guid: string;
  start_date: string;
  start_timestamp: number | null; // Keep nullable as per backend data
  distance: string;
  discipline: string;
  starters_count: number;
  racecourse: string;
  ground_condition: string;
  weather_description: string;
}

export interface ReunionData {
  [reunion_label: string]: RaceDetail[];
}

export interface ExtendedMeetings {
  title: string;
  noMeetings: string;
  loading: string;
  cached?: string;
  error?: string;
  updated?: string;
}

export interface Participant {
  num_pmu: string;
  name: string;
  type: "favori" | "tocard" | "watched";
  latest_odds?:
    | {
        time_diff: string;
        odds: string;
        odds_rank: string;
        odds_date?: string;
        big_bet: string;
      }
    | "No odds available"
    | "Error loading odds";
}
