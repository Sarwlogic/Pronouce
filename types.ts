
export enum AppState {
  SETUP = 'SETUP',
  READY_TO_LISTEN = 'READY_TO_LISTEN',
  LISTENING = 'LISTENING',
  ANALYZING = 'ANALYZING',
  FEEDBACK = 'FEEDBACK',
}

export interface UserSettings {
  childName: string;
  targetWord: string;
}

export interface Attempt {
  attemptNumber: number;
  transcript: string;
}
