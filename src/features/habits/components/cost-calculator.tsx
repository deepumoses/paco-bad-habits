'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Clock } from 'lucide-react';

export function CostCalculator() {
  const [cost, setCost] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [type, setType] = useState('money'); // money or time

  const calculateCost = (years: number) => {
    const numCost = parseFloat(cost) || 0;
    let multiplier = 0;

    switch (frequency) {
      case 'daily': multiplier = 365; break;
      case 'weekly': multiplier = 52; break;
      case 'monthly': multiplier = 12; break;
    }

    const total = numCost * multiplier * years;

    if (type === 'time') {
      // Convert minutes to hours/days
      const hours = Math.round(total / 60);
      return `${hours.toLocaleString()} hours`;
    }

    return `$${total.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Cost of Habit Calculator
        </CardTitle>
        <CardDescription>
          See how much your bad habit costs you over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="flex gap-2">
            <Select value={type} onValueChange={setType}>
               <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="money">Money ($)</SelectItem>
                <SelectItem value="time">Time (min)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={type === 'money' ? "Cost per occurrence" : "Minutes per occurrence"}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">1 Year</div>
            <div className="text-xl font-bold">{calculateCost(1)}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">5 Years</div>
            <div className="text-xl font-bold">{calculateCost(5)}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">10 Years</div>
            <div className="text-xl font-bold">{calculateCost(10)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
