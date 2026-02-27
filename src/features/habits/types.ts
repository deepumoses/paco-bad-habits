// src/features/habits/types.ts

export type HabitType = 'positive' | 'negative' | 'neutral';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  description?: string;
  createdAt: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'missed' | 'skipped';
  trigger?: string; // e.g. "Time", "Location", "Mood"
  timestamp: number;
}

export interface ImplementationIntention {
  id: string;
  situation: string;
  action: string;
}

export interface FrictionStep {
  id: string;
  habitId: string;
  step: string;
}

export interface AccountabilityContract {
  id: string;
  partnerName: string;
  partnerEmail?: string;
  penalty: string;
  signedAt: number;
}

export interface HabitStack {
  id: string;
  oldHabit: string;
  newHabit: string;
}

export interface TemptationBundle {
  id: string;
  requirement: string;
  reward: string;
}

export interface Identity {
  title: string;
  description?: string;
}

export interface SelfReflection {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: number;
}


// Store Interface
export interface HabitsState {
  habits: Habit[];
  logs: HabitLog[];
  intentions: ImplementationIntention[];
  frictionSteps: FrictionStep[];
  contracts: AccountabilityContract[];
  stacks: HabitStack[];
  bundles: TemptationBundle[];
  identity: Identity;
  reflections: SelfReflection[];

  // Actions
  addHabit: (name: string, type: HabitType, description?: string) => void;
  removeHabit: (id: string) => void;
  logHabit: (habitId: string, date: string, status: 'completed' | 'missed' | 'skipped', trigger?: string) => void;
  addIntention: (situation: string, action: string) => void;
  removeIntention: (id: string) => void;
  addFrictionStep: (habitId: string, step: string) => void;
  removeFrictionStep: (id: string) => void;
  setContract: (contract: AccountabilityContract) => void;
  addStack: (oldHabit: string, newHabit: string) => void;
  removeStack: (id: string) => void;
  addBundle: (requirement: string, reward: string) => void;
  removeBundle: (id: string) => void;
  setIdentity: (title: string, description?: string) => void;
  addReflection: (content: string, sentiment: 'positive' | 'negative' | 'neutral', date: string) => void;
  removeReflection: (id: string) => void;
}
