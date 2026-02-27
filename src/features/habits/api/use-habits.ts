import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Habit, HabitLog, ImplementationIntention, FrictionStep, AccountabilityContract, HabitStack, TemptationBundle, Identity, HabitType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface HabitsData {
  habits: Habit[];
  logs: HabitLog[];
  intentions: ImplementationIntention[];
  frictionSteps: FrictionStep[];
  contracts: AccountabilityContract[];
  stacks: HabitStack[];
  bundles: TemptationBundle[];
  identity: Identity;
}

const fetchHabits = async (): Promise<HabitsData> => {
  const res = await fetch('/api/habits');
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
};

export const useHabitsQuery = () => {
  return useQuery<HabitsData>({
    queryKey: ['habits'],
    queryFn: fetchHabits,
    initialData: {
        habits: [],
        logs: [],
        intentions: [],
        frictionSteps: [],
        contracts: [],
        stacks: [],
        bundles: [],
        identity: { title: 'I am someone who...', description: '' },
    }
  });
};

export const useAddHabitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, type, description }: { name: string; type: HabitType; description?: string }) => {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, description }),
      });
      if (!res.ok) throw new Error('Failed to create habit');
      return res.json();
    },
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousData = queryClient.getQueryData<HabitsData>(['habits']);
      const tempId = uuidv4();
      queryClient.setQueryData<HabitsData>(['habits'], (old) => {
        if (!old) return old;
        return {
          ...old,
          habits: [...old.habits, { ...newHabit, id: tempId, createdAt: Date.now() } as any], // casting any to bypass strict type mismatch with backend response vs local
        };
      });
      return { previousData };
    },
    onError: (err, newHabit, context) => {
      queryClient.setQueryData(['habits'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useRemoveHabitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete habit');
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousData = queryClient.getQueryData<HabitsData>(['habits']);
      queryClient.setQueryData<HabitsData>(['habits'], (old) => {
        if (!old) return old;
        return {
          ...old,
          habits: old.habits.filter((h) => h.id !== id),
        };
      });
      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['habits'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useLogHabitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ habitId, date, status, trigger }: { habitId: string; date: string; status: 'completed' | 'missed' | 'skipped'; trigger?: string }) => {
      const res = await fetch(`/api/habits/${habitId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status, trigger }),
      });
      if (!res.ok) throw new Error('Failed to log habit');
      return res.json();
    },
    onMutate: async ({ habitId, date, status, trigger }) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousData = queryClient.getQueryData<HabitsData>(['habits']);
      queryClient.setQueryData<HabitsData>(['habits'], (old) => {
        if (!old) return old;
        const newLogs = old.logs.filter((l) => !(l.habitId === habitId && l.date === date));
        newLogs.push({ id: uuidv4(), habitId, date, status, trigger, timestamp: Date.now() });
        return {
          ...old,
          logs: newLogs,
        };
      });
      return { previousData };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['habits'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useAddIntentionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ situation, action }: { situation: string; action: string }) => {
            const res = await fetch('/api/habits/intentions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ situation, action }),
            });
            if (!res.ok) throw new Error('Failed to add intention');
            return res.json();
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    intentions: [...old.intentions, { ...newItem, id: uuidv4() } as any]
                };
            });
            return { previousData };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useRemoveIntentionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habits/intentions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete intention');
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    intentions: old.intentions.filter(i => i.id !== id)
                };
            });
            return { previousData };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useAddFrictionStepMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ habitId, step }: { habitId: string; step: string }) => {
            const res = await fetch(`/api/habits/${habitId}/friction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step }),
            });
            if (!res.ok) throw new Error('Failed to add friction step');
            return res.json();
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    frictionSteps: [...old.frictionSteps, { ...newItem, id: uuidv4() } as any]
                };
            });
            return { previousData };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useRemoveFrictionStepMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habits/friction/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete friction step');
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    frictionSteps: old.frictionSteps.filter(f => f.id !== id)
                };
            });
            return { previousData };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useSetContractMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contract: { partnerName: string; penalty: string; partnerEmail?: string }) => {
            const res = await fetch('/api/habits/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contract),
            });
            if (!res.ok) throw new Error('Failed to set contract');
            return res.json();
        },
        onMutate: async (newContract) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    contracts: [{ ...newContract, id: uuidv4(), signedAt: Date.now() } as any]
                };
            });
            return { previousData };
        },
        onError: (err, newContract, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useAddStackMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ oldHabit, newHabit }: { oldHabit: string; newHabit: string }) => {
            const res = await fetch('/api/habits/stacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldHabit, newHabit }),
            });
            if (!res.ok) throw new Error('Failed to add stack');
            return res.json();
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    stacks: [...old.stacks, { ...newItem, id: uuidv4() } as any]
                };
            });
            return { previousData };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useRemoveStackMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habits/stacks/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete stack');
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    stacks: old.stacks.filter(s => s.id !== id)
                };
            });
            return { previousData };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useAddBundleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ requirement, reward }: { requirement: string; reward: string }) => {
            const res = await fetch('/api/habits/bundles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirement, reward }),
            });
            if (!res.ok) throw new Error('Failed to add bundle');
            return res.json();
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    bundles: [...old.bundles, { ...newItem, id: uuidv4() } as any]
                };
            });
            return { previousData };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useRemoveBundleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habits/bundles/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete bundle');
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    bundles: old.bundles.filter(b => b.id !== id)
                };
            });
            return { previousData };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};

export const useUpdateIdentityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ title, description }: { title: string; description?: string }) => {
            const res = await fetch('/api/habits/identity', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });
            if (!res.ok) throw new Error('Failed to update identity');
            return res.json();
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousData = queryClient.getQueryData<HabitsData>(['habits']);
            queryClient.setQueryData<HabitsData>(['habits'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    identity: { ...old.identity, ...newItem }
                };
            });
            return { previousData };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['habits'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
};
