import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Agent as BackendAgent, InsuranceType } from '../backend';
import { Phone, Mail } from 'lucide-react';

interface AgentCardProps {
  agent: BackendAgent;
  onContact?: (agent: BackendAgent) => void;
}

const typeLabels: Record<InsuranceType, string> = {
  [InsuranceType.health]: 'Health',
  [InsuranceType.auto]: 'Auto',
  [InsuranceType.life]: 'Life',
  [InsuranceType.home]: 'Home',
};

const avatarColors = [
  'from-teal-deep to-teal-mid',
  'from-blue-600 to-blue-400',
  'from-purple-600 to-purple-400',
  'from-amber-600 to-amber-400',
];

export default function AgentCard({ agent, onContact }: AgentCardProps) {
  const colorClass = avatarColors[agent.agentId.charCodeAt(agent.agentId.length - 1) % avatarColors.length];
  const initials = agent.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardContent className="pt-6 pb-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-lg">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-foreground text-lg leading-tight">{agent.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
              {agent.specialization.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {typeLabels[type]}
                </Badge>
              ))}
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <a href={`tel:${agent.phone}`} className="hover:text-foreground transition-colors">{agent.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href={`mailto:${agent.email}`} className="hover:text-foreground transition-colors truncate">{agent.email}</a>
              </div>
            </div>
          </div>
        </div>

        {onContact && (
          <button
            onClick={() => onContact(agent)}
            className="mt-4 w-full py-2 px-4 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-accent transition-colors"
          >
            Send Message
          </button>
        )}
      </CardContent>
    </Card>
  );
}
