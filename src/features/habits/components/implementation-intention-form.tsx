'use client';

import { useHabitsStore } from '../store/habits-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2 } from 'lucide-react';

const intentionSchema = z.object({
  situation: z.string().min(1, 'Situation is required'),
  action: z.string().min(1, 'Action is required'),
});

type IntentionFormValues = z.infer<typeof intentionSchema>;

export function ImplementationIntentionForm() {
  const { intentions, addIntention, removeIntention } = useHabitsStore();

  const form = useForm<IntentionFormValues>({
    resolver: zodResolver(intentionSchema),
    defaultValues: {
      situation: '',
      action: '',
    },
  });

  const onSubmit = (data: IntentionFormValues) => {
    addIntention(data.situation, data.action);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Intentions</CardTitle>
        <CardDescription>
          Use the "If-Then" logic to plan your habits. "When [Situation], I will [Action]."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When (Situation)...</FormLabel>
                    <FormControl>
                      <Input placeholder="I sit at my desk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I will (Action)...</FormLabel>
                    <FormControl>
                      <Input placeholder="Meditate for 1 minute" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Add Intention</Button>
        </Form>

        <div className="space-y-2">
          {intentions.map((intention) => (
            <div key={intention.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <p className="text-sm">
                When <span className="font-bold">{intention.situation}</span>, I will <span className="font-bold">{intention.action}</span>.
              </p>
              <Button size="icon" variant="ghost" onClick={() => removeIntention(intention.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
          {intentions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No intentions set yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
