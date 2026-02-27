// src/features/habits/store/habits-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  HabitsState
} from '../types';

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],
      logs: [],
      intentions: [],
      frictionSteps: [],
      contracts: [],
      stacks: [],
      bundles: [],
      identity: { title: 'I am someone who...', description: '' },
      reflections: [],

      addHabit: (name, type, description) => set((state) => ({
        habits: [...state.habits, { id: uuidv4(), name, type, description, createdAt: Date.now() }]
      })),

      removeHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        logs: state.logs.filter((l) => l.habitId !== id),
        frictionSteps: state.frictionSteps.filter((f) => f.habitId !== id)
      })),

      logHabit: (habitId, date, status, trigger) => set((state) => {
        // Remove existing log for same habit and date if exists (to allow toggle/update)
        const filteredLogs = state.logs.filter(
          (log) => !(log.habitId === habitId && log.date === date)
        );
        return {
          logs: [...filteredLogs, { id: uuidv4(), habitId, date, status, trigger, timestamp: Date.now() }]
        };
      }),

      addIntention: (situation, action) => set((state) => ({
        intentions: [...state.intentions, { id: uuidv4(), situation, action }]
      })),

      removeIntention: (id) => set((state) => ({
        intentions: state.intentions.filter((i) => i.id !== id)
      })),

      addFrictionStep: (habitId, step) => set((state) => ({
        frictionSteps: [...state.frictionSteps, { id: uuidv4(), habitId, step }]
      })),

      removeFrictionStep: (id) => set((state) => ({
        frictionSteps: state.frictionSteps.filter((f) => f.id !== id)
      })),

      setContract: (contract) => set((state) => ({
        contracts: [contract] // Keeping only one contract for simplicity, or could be array
      })),

      addStack: (oldHabit, newHabit) => set((state) => ({
        stacks: [...state.stacks, { id: uuidv4(), oldHabit, newHabit }]
      })),

      removeStack: (id) => set((state) => ({
        stacks: state.stacks.filter((s) => s.id !== id)
      })),

      addBundle: (requirement, reward) => set((state) => ({
        bundles: [...state.bundles, { id: uuidv4(), requirement, reward }]
      })),

      removeBundle: (id) => set((state) => ({
        bundles: state.bundles.filter((b) => b.id !== id)
      })),

      setIdentity: (title, description) => set(() => ({
        identity: { title, description }
      })),

      addReflection: (content, sentiment, date) => set((state) => ({
        reflections: [
          // Filter out existing reflection for the same date if needed (one per day), or allow multiple
          // Let's allow multiple for now, or replace if date matches exactly?
          // Requirements say "input via text for the current day". Let's just append.
          { id: uuidv4(), content, sentiment, date, timestamp: Date.now() },
          ...state.reflections
        ]
      })),

      removeReflection: (id) => set((state) => ({
        reflections: state.reflections.filter((r) => r.id !== id)
      })),
    }),
    {
      name: 'habits-storage', // name of the item in the storage (must be unique)
    }
  )
);
