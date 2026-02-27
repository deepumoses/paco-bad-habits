// src/features/habits/components/accountability-contract.tsx

'use client';

import { useHabitsStore } from '../store/habits-store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Scroll, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AccountabilityContract() {
  const { contracts, setContract } = useHabitsStore();
  const [partnerName, setPartnerName] = useState('');
  const [penalty, setPenalty] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const activeContract = contracts[0]; // Assuming single active contract for now

  const handleSign = () => {
    if (partnerName && penalty) {
      setContract({
        id: crypto.randomUUID(),
        partnerName,
        penalty,
        signedAt: Date.now()
      });
      setIsOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5 text-indigo-500" />
          Accountability Contract
        </CardTitle>
        <CardDescription>
          Make the costs of your bad habits public and painful.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeContract ? (
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-6 rounded-lg text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <Scroll className="h-24 w-24" />
             </div>
             <h3 className="font-serif text-xl font-bold mb-4">Official Contract</h3>
             <p className="mb-4">
               I have committed to my habit goals. If I fail, I am accountable to
               <span className="font-bold mx-1">{activeContract.partnerName}</span>.
             </p>
             <div className="p-3 bg-white dark:bg-black/20 rounded mb-4">
               <span className="text-xs text-muted-foreground uppercase">The Penalty</span>
               <p className="font-bold text-red-600">{activeContract.penalty}</p>
             </div>
             <p className="text-xs text-muted-foreground">
               Signed on {new Date(activeContract.signedAt).toLocaleDateString()}
             </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No active contract.</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Create Contract</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Habit Contract</DialogTitle>
                  <DialogDescription>
                    Create a binding agreement to increase the cost of failure.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="partner">Accountability Partner</Label>
                    <Input
                      id="partner"
                      placeholder="Name of your partner"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="penalty">Penalty for Failure</Label>
                    <Textarea
                      id="penalty"
                      placeholder="If I miss my habit, I will..."
                      value={penalty}
                      onChange={(e) => setPenalty(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSign}>Sign Contract</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
