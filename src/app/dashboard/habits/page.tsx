'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IdentityHeader } from '@/features/habits/components/identity-header';
import { HabitScorecard } from '@/features/habits/components/habit-scorecard';
import { ImplementationIntentionForm } from '@/features/habits/components/implementation-intention-form';
import { FrictionScorecard } from '@/features/habits/components/friction-scorecard';
import { HabitStacking } from '@/features/habits/components/habit-stacking';
import { CostCalculator } from '@/features/habits/components/cost-calculator';
import { AccountabilityContract } from '@/features/habits/components/accountability-contract';
import { TemptationBundling } from '@/features/habits/components/temptation-bundling';
import { NeverMissTwice } from '@/features/habits/components/never-miss-twice';

export default function HabitsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Atomic Habits"
            description="Master your habits using the Four Laws of Behavior Change."
          />
        </div>
        <Separator />

        <div className="space-y-6">
          <IdentityHeader />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 space-y-6">
              <HabitScorecard />
              <ImplementationIntentionForm />
              <HabitStacking />
            </div>
            <div className="col-span-3 space-y-6">
              <NeverMissTwice />
              <FrictionScorecard />
              <TemptationBundling />
              <CostCalculator />
              <AccountabilityContract />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
