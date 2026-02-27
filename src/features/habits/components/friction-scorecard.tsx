'use client';

import { useHabitsQuery, useAddFrictionStepMutation, useRemoveFrictionStepMutation } from '../api/use-habits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';

export function FrictionScorecard() {
  const { data } = useHabitsQuery();
  const { mutate: addFrictionStep } = useAddFrictionStepMutation();
  const { mutate: removeFrictionStep } = useRemoveFrictionStepMutation();

  const frictionSteps = data?.frictionSteps || [];
  const habits = data?.habits || [];

  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [step, setStep] = useState('');

  const negativeHabits = habits.filter(h => h.type === 'negative');

  const handleAddStep = () => {
    if (selectedHabitId && step.trim()) {
      addFrictionStep({ habitId: selectedHabitId, step });
      setStep('');
    }
  };

  const getHabitName = (id: string) => habits.find(h => h.id === id)?.name || 'Unknown Habit';

  return (
    <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/10 dark:border-orange-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
          Friction Scorecard
        </CardTitle>
        <CardDescription>
          Make bad habits difficult. List steps to increase friction between you and the habit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Bad Habit" />
            </SelectTrigger>
            <SelectContent>
              {negativeHabits.map((h) => (
                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Step to increase friction (e.g., Unplug TV)"
            value={step}
            onChange={(e) => setStep(e.target.value)}
          />
          <Button onClick={handleAddStep} disabled={!selectedHabitId || !step.trim()}>Add</Button>
        </div>

        <div className="space-y-2">
          {frictionSteps.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                  {getHabitName(item.habitId)}
                </span>
                <span className="text-sm">{item.step}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeFrictionStep(item.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
          {frictionSteps.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No friction steps added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
