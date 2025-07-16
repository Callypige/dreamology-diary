export interface Dream {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lucidity: boolean;
  tags: string[];
  intensity: number;
  type: "lucide" | "cauchemar" | "autre";
  recurring: boolean;
  dreamScore: number;
  mood: string;
  sleepTime: string; // HH:mm format
  wokeUpTime: string; // HH:mm format
  hasAudio: boolean;
  audioNote?: string; // URL to audio file
  location: string;
  characters: string[];
  beforeSleepMood: string;
  dreamClarity: number; // 1 to 10 scale
  private: boolean;
}