'use client';

import { useHabitsStore } from '../store/habits-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useState } from 'react';
import { Send, History, Smile, Frown, Meh, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { SelfReflection as SelfReflectionType } from '../types';

export function SelfReflection() {
  const { reflections, addReflection, removeReflection } = useHabitsStore();
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [showTimeline, setShowTimeline] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const existingReflection = reflections.find((r) => r.date === today);

  const handleSave = () => {
    if (content.trim()) {
      if (existingReflection) {
        removeReflection(existingReflection.id);
      }
      addReflection(content, sentiment, today);
      setContent('');
      setSentiment('neutral');
      // Optionally switch to timeline view or stay on input
    }
  };

  const sortedReflections = [...reflections].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Daily Reflection</CardTitle>
          <CardDescription>
            Reflect on your progress. How did you do today?
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTimeline(!showTimeline)}
          title={showTimeline ? "Back to Input" : "View Timeline"}
        >
          <History className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {!showTimeline ? (
          <div className="flex flex-col gap-4 h-full">
            <Textarea
              placeholder="Today, I felt..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none flex-1"
            />

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <ToggleGroup type="single" value={sentiment} onValueChange={(val: any) => val && setSentiment(val)}>
                <ToggleGroupItem value="positive" aria-label="Positive">
                  <Smile className={cn("h-4 w-4 mr-2", sentiment === 'positive' && "text-green-500")} />
                  Positive
                </ToggleGroupItem>
                <ToggleGroupItem value="neutral" aria-label="Neutral">
                  <Meh className={cn("h-4 w-4 mr-2", sentiment === 'neutral' && "text-yellow-500")} />
                  Neutral
                </ToggleGroupItem>
                <ToggleGroupItem value="negative" aria-label="Negative">
                  <Frown className={cn("h-4 w-4 mr-2", sentiment === 'negative' && "text-red-500")} />
                  Negative
                </ToggleGroupItem>
              </ToggleGroup>

              <Button onClick={handleSave} disabled={!content.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            {existingReflection && (
               <p className="text-xs text-center text-muted-foreground">
                 You have already reflected today. Saving will update your entry.
               </p>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {sortedReflections.map((reflection) => (
                <div key={reflection.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm relative group">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {format(new Date(reflection.date), 'MMMM do, yyyy')}
                      </span>
                      <div className="flex items-center gap-2">
                        {reflection.sentiment === 'positive' && <Smile className="h-4 w-4 text-green-500" />}
                        {reflection.sentiment === 'neutral' && <Meh className="h-4 w-4 text-yellow-500" />}
                        {reflection.sentiment === 'negative' && <Frown className="h-4 w-4 text-red-500" />}

                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeReflection(reflection.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                      </div>
                   </div>
                   <p className="text-sm whitespace-pre-wrap">{reflection.content}</p>
                </div>
              ))}
              {sortedReflections.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No reflections yet. Start writing today!
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
