'use client';

import { useHabitsStore } from '../store/habits-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Minus, Equal, Trash2, Calendar, MapPin, Smile, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HabitType } from '../types';
import confetti from 'canvas-confetti';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export function HabitScorecard() {
  const { habits, addHabit, removeHabit, logHabit, logs } = useHabitsStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<HabitType>('neutral');

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName, newHabitType);
      setNewHabitName('');
      setNewHabitType('neutral');
      setIsAdding(false);
    }
  };

  const handleLogHabit = (habitId: string, status: 'completed' | 'missed' | 'skipped', trigger?: string) => {
    logHabit(habitId, today, status, trigger);
    if (status === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const getHabitStatus = (habitId: string) => {
    const log = logs.find((l) => l.habitId === habitId && l.date === today);
    return log?.status;
  };

  const getTypeIcon = (type: HabitType) => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Equal className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Habit Scorecard</CardTitle>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button size="sm">Add Habit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Habit Name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
              />
              <Select
                value={newHabitType}
                onValueChange={(val) => setNewHabitType(val as HabitType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive (+)</SelectItem>
                  <SelectItem value="negative">Negative (-)</SelectItem>
                  <SelectItem value="neutral">Neutral (=)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddHabit}>Save Habit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Habit</TableHead>
              <TableHead className="text-center">Today's Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No habits tracked yet. Add one to start your scorecard.
                </TableCell>
              </TableRow>
            ) : (
              habits.map((habit) => {
                const status = getHabitStatus(habit.id);
                return (
                  <TableRow key={habit.id}>
                    <TableCell>{getTypeIcon(habit.type)}</TableCell>
                    <TableCell className="font-medium">{habit.name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Popover for optional trigger logging */}
                        <Popover>
                          <PopoverTrigger asChild>
                             <Button
                              size="icon"
                              variant={status === 'completed' ? 'default' : 'outline'}
                              className="h-8 w-8 rounded-full"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Log Completion</h4>
                                <p className="text-sm text-muted-foreground">
                                  Optionally tag a trigger that helped you.
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor={`trigger-${habit.id}`}>Trigger</Label>
                                  <Select onValueChange={(val) => handleLogHabit(habit.id, 'completed', val)}>
                                    <SelectTrigger className="col-span-2 h-8">
                                      <SelectValue placeholder="Select trigger" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Time">Time</SelectItem>
                                      <SelectItem value="Location">Location</SelectItem>
                                      <SelectItem value="Mood">Mood</SelectItem>
                                      <SelectItem value="Social">Social</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button size="sm" onClick={() => handleLogHabit(habit.id, 'completed')}>
                                  Quick Log (No Trigger)
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        <Button
                          size="icon"
                          variant={status === 'missed' ? 'destructive' : 'outline'}
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleLogHabit(habit.id, 'missed')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeHabit(habit.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
