export interface Topic {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  suggestedResearchAreas: string[];
}

export type AppState = 
  | 'landing'
  | 'generating'
  | 'topic_reveal'
  | 'preparation'
  | 'speaking'
  | 'result';

export interface Feedback {
  transcript: string;
  score: number;
  strengths: string[];
  improvements: string[];
  overall: string;
}

export interface ChallengeResult {
  topic: Topic;
  duration: number;
  audioBlob: Blob;
  date: Date;
  feedback?: Feedback;
}
