import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type InsurancePlan, InsuranceType } from '../backend';
import { CheckCircle, Heart, Car, Users, Home, ArrowRight } from 'lucide-react';

interface PlanCardProps {
  plan: InsurancePlan;
}

const typeConfig: Record<InsuranceType, { label: string; icon: React.ElementType; badgeClass: string }> = {
  [InsuranceType.health]: { label: 'Health', icon: Heart, badgeClass: 'bg-rose-100 text-rose-700 border-rose-200' },
  [InsuranceType.auto]: { label: 'Auto', icon: Car, badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  [InsuranceType.life]: { label: 'Life', icon: Users, badgeClass: 'bg-purple-100 text-purple-700 border-purple-200' },
  [InsuranceType.home]: { label: 'Home', icon: Home, badgeClass: 'bg-amber-100 text-amber-700 border-amber-200' },
};

function formatCurrency(amount: bigint): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount));
}

export default function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate();
  const cfg = typeConfig[plan.insuranceType];
  const Icon = cfg.icon;

  const handleGetQuote = () => {
    navigate({
      to: '/',
      search: { type: plan.insuranceType, plan: plan.name },
    });
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent-foreground" />
          </div>
          <Badge variant="outline" className={`text-xs ${cfg.badgeClass}`}>
            {cfg.label}
          </Badge>
        </div>
        <CardTitle className="font-display text-lg leading-tight">{plan.name}</CardTitle>
        <CardDescription className="text-sm">
          Coverage up to <span className="font-semibold text-foreground">{formatCurrency(plan.coverageAmount)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-1.5">
          {plan.features.slice(0, 4).map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-muted-foreground pl-6">+{plan.features.length - 4} more features</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Monthly premium</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(plan.premium)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
        </div>
        <Button size="sm" onClick={handleGetQuote} className="gap-1.5">
          Get Quote
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
