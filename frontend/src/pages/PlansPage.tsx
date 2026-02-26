import { useState } from 'react';
import { useGetAllInsurancePlans } from '../hooks/useQueries';
import PlanCard from '../components/PlanCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { InsuranceType } from '../backend';
import { Heart, Car, Users, Home, LayoutGrid } from 'lucide-react';

const tabs = [
  { value: 'all', label: 'All Plans', icon: LayoutGrid },
  { value: InsuranceType.health, label: 'Health', icon: Heart },
  { value: InsuranceType.auto, label: 'Auto', icon: Car },
  { value: InsuranceType.life, label: 'Life', icon: Users },
  { value: InsuranceType.home, label: 'Home', icon: Home },
];

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: plans = [], isLoading } = useGetAllInsurancePlans();

  const filteredPlans = activeTab === 'all'
    ? plans
    : plans.filter((p) => p.insuranceType === activeTab);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Insurance Plans
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Browse our comprehensive range of insurance plans. Find the coverage that fits your needs and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Content */}
      <section className="container mx-auto px-4 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1.5 text-sm">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ value }) => (
            <TabsContent key={value} value={value}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-5 space-y-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-4/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">No Plans Available</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all'
                      ? 'No insurance plans have been added yet.'
                      : `No ${activeTab} insurance plans are currently available.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPlans.map((plan) => (
                    <PlanCard key={plan.planId} plan={plan} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
