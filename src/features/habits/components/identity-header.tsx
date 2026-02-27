'use client';

import { useState } from 'react';
import { useHabitsStore } from '../store/habits-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Check, X } from 'lucide-react';

export function IdentityHeader() {
  const { identity, setIdentity } = useHabitsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(identity.title);

  const handleSave = () => {
    setIdentity(tempTitle, identity.description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(identity.title);
    setIsEditing(false);
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Identity-Based Habit
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-2xl font-bold h-12"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h1 className="text-3xl font-bold text-primary">{identity.title}</h1>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
