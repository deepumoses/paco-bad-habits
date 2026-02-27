'use client';

import { useHabitsStore } from '../store/habits-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, AlertTriangle } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function NeverMissTwice() {
  const { habits, logs } = useHabitsStore();

  const today = new Date();
  const yesterday = subDays(today, 1);
  const historyDays = 7;

  // Calculate streaks and check for misses
  const getHabitStats = (habitId: string) => {
    // Get logs for this habit
    const habitLogs = logs
      .filter(l => l.habitId === habitId)
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first


    // Check if missed yesterday
    // Find a log for yesterday that is 'missed'
    const missedLogYesterday = habitLogs.find(l =>
      isSameDay(parseISO(l.date), yesterday) && l.status === 'missed'
    );

    // Check if missed today (so far) or explicitly marked as missed
    const missedLogToday = habitLogs.find(l =>
      isSameDay(parseISO(l.date), today) && l.status === 'missed'
    );

    const missedYesterday = !!missedLogYesterday;
    const missedToday = !!missedLogToday;

    // Check if recovered today (meaning completed today)
    const completedToday = habitLogs.some(l =>
      isSameDay(parseISO(l.date), today) && l.status === 'completed'
    );


    // Get last 7 days history
    // We create an array of dates from today back to 6 days ago
    const history = Array.from({ length: historyDays }).map((_, i) => {
      // i=0 is today, i=6 is 6 days ago. We want reverse chronological order (oldest -> newest) for display usually,
      // but the map here goes 0 (today), 1 (yesterday). Let's construct it correctly.
      // Let's iterate from oldest (6 days ago) to newest (today)
      const date = subDays(today, (historyDays - 1) - i);
      const dateStr = format(date, 'yyyy-MM-dd');

      const log = habitLogs.find(l => l.date === dateStr);

      return {
        date,
        status: log?.status || 'none'
      };
    });

    return { missedYesterday, missedToday, completedToday, history };
  };

  // Only track positive habits for "Never Miss Twice" rule usually, as negative habits you want to miss!
  // But let's include all non-negative habits or just positive ones.
  const activeHabits = habits.filter(h => h.type === 'positive');

  if (activeHabits.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Never Miss Twice
        </CardTitle>
        <CardDescription>
          "The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activeHabits.map(habit => {
            const { missedYesterday, completedToday, history } = getHabitStats(habit.id);

            // Alert logic: If missed yesterday AND NOT completed today yet -> ALERT
            const isDanger = missedYesterday && !completedToday;

            return (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{habit.name}</span>
                  {isDanger && (
                    <div className="flex items-center text-destructive text-xs font-bold animate-pulse">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Recover Today!
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center gap-1">
                  {history.map((day, i) => {
                     let bgClass = "bg-secondary";
                     let borderClass = "border-transparent";
                     let textClass = "";

                     if (day.status === 'completed') {
                        bgClass = "bg-green-500";
                        borderClass = "border-green-600";
                        textClass = "text-white";
                     } else if (day.status === 'missed') {
                        bgClass = "bg-red-500";
                        borderClass = "border-red-600";
                        textClass = "text-white";
                     } else if (day.status === 'skipped') {
                        bgClass = "bg-gray-200 dark:bg-gray-800";
                        borderClass = "border-gray-300 dark:border-gray-700";
                     }

                     const isToday = isSameDay(day.date, today);

                     return (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                w-8 h-8 rounded flex items-center justify-center text-xs border cursor-default transition-all
                                ${bgClass} ${borderClass} ${textClass}
                                ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                              `}
                            >
                               {format(day.date, 'd')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{format(day.date, 'MMM d')}</p>
                            <p className="capitalize text-xs">{day.status}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
