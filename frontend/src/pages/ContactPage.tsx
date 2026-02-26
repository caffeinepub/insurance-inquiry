import { useState } from 'react';
import { useGetAllAgents } from '../hooks/useQueries';
import AgentCard from '../components/AgentCard';
import ContactMessageForm from '../components/ContactMessageForm';
import { Skeleton } from '@/components/ui/skeleton';
import { type Agent as BackendAgent } from '../backend';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { data: agents = [], isLoading } = useGetAllAgents();
  const [preselectedAgentId, setPreselectedAgentId] = useState<string | undefined>();

  const handleContactAgent = (agent: BackendAgent) => {
    setPreselectedAgentId(agent.agentId);
    // Scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Contact an Agent
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our licensed insurance agents are here to help you find the right coverage.
              Reach out directly or send a message below.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Agents List */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Our Agents</h2>
              <p className="text-sm text-muted-foreground">Click "Send Message" to pre-select an agent in the form.</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border p-5">
                    <div className="flex gap-4">
                      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">No Agents Listed</h3>
                <p className="text-muted-foreground text-sm">Agent information will be available soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <AgentCard key={agent.agentId} agent={agent} onContact={handleContactAgent} />
                ))}
              </div>
            )}

            {/* Office Info */}
            <div className="bg-accent/50 rounded-xl p-5 border border-accent">
              <h3 className="font-semibold text-foreground mb-3">Office Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>123 Insurance Plaza, Financial District, NY 10004</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>1-800-SECURE-1 (Mon–Fri, 9am–6pm EST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>support@securelife.insurance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2" id="contact-form">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Send a Message</h2>
            <ContactMessageForm agents={agents} preselectedAgentId={preselectedAgentId} />
          </div>
        </div>
      </section>
    </div>
  );
}
