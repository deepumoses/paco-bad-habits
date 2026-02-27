'use client';

import { useHabitsQuery, useAddStackMutation, useRemoveStackMutation } from '../api/use-habits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ArrowRight, Layers, Trash2 } from 'lucide-react';

export function HabitStacking() {
  const { data } = useHabitsQuery();
  const { mutate: addStack } = useAddStackMutation();
  const { mutate: removeStack } = useRemoveStackMutation();

  const stacks = data?.stacks || [];

  const [oldHabit, setOldHabit] = useState('');
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = () => {
    if (oldHabit.trim() && newHabit.trim()) {
      addStack({ oldHabit, newHabit });
      setOldHabit('');
      setNewHabit('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          Habit Stacking
        </CardTitle>
        <CardDescription>
          "After [Current Habit], I will [New Habit]."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center mb-6">
          <Input
            placeholder="Current Habit (e.g. Pour coffee)"
            value={oldHabit}
            onChange={(e) => setOldHabit(e.target.value)}
          />
          <ArrowRight className="hidden md:block text-muted-foreground" />
          <Input
            placeholder="New Habit (e.g. Meditate)"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <Button onClick={handleAdd}>Stack</Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {stacks.map((stack, index) => (
            <AccordionItem key={stack.id} value={stack.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Stack #{index + 1}:</span>
                  <span>{stack.oldHabit}</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>{stack.newHabit}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex justify-between items-center bg-secondary/20 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  By anchoring your new habit to an established one, you leverage the strength of your existing neural networks.
                </p>
                <Button size="sm" variant="destructive" onClick={() => removeStack(stack.id)}>
                  Remove
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         {stacks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No habit stacks created yet.
            </p>
          )}
      </CardContent>
    </Card>
  );
}
