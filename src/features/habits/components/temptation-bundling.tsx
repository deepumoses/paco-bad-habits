'use client';

import { useHabitsStore } from '../store/habits-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Gift, Trash2, Lock } from 'lucide-react';

export function TemptationBundling() {
  const { bundles, addBundle, removeBundle } = useHabitsStore();
  const [requirement, setRequirement] = useState('');
  const [reward, setReward] = useState('');

  const handleAdd = () => {
    if (requirement.trim() && reward.trim()) {
      addBundle(requirement, reward);
      setRequirement('');
      setReward('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-500" />
          Temptation Bundling
        </CardTitle>
        <CardDescription>
          Only do [Indulgence] while doing [Exercise/Task].
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <div className="grid flex-1 gap-2">
             <Input
                placeholder="Requirement (e.g. Treadmill)"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
              <Input
                placeholder="Reward (e.g. Netflix)"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
              />
          </div>
          <Button className="h-auto" onClick={handleAdd}>Bundle</Button>
        </div>

        <div className="grid gap-4">
          {bundles.map((bundle) => (
             <div key={bundle.id} className="relative p-4 border rounded-lg flex items-center justify-between overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-secondary rounded">
                     <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-sm">
                    Only <span className="font-bold text-purple-600">{bundle.reward}</span> while <span className="font-bold">{bundle.requirement}</span>.
                  </div>
                </div>
                 <Button size="icon" variant="ghost" onClick={() => removeBundle(bundle.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                 </Button>
             </div>
          ))}
           {bundles.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No temptation bundles created yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
