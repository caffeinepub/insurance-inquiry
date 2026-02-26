import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSendMessageToAgent, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { type Agent as BackendAgent } from '../backend';
import { toast } from 'sonner';
import { CheckCircle, MessageSquare } from 'lucide-react';

interface ContactMessageFormProps {
  agents: BackendAgent[];
  preselectedAgentId?: string;
}

export default function ContactMessageForm({ agents, preselectedAgentId }: ContactMessageFormProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();

  const [selectedAgentId, setSelectedAgentId] = useState(preselectedAgentId || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: sendMessage, isPending } = useSendMessageToAgent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !message.trim()) return;

    const fullMessage = subject ? `Subject: ${subject}\n\n${message}` : message;

    sendMessage(
      { agentId: selectedAgentId, message: fullMessage },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success('Message sent successfully!');
        },
        onError: () => {
          toast.error('Failed to send message. Please try again.');
        },
      }
    );
  };

  if (submitted) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Your message has been delivered. An agent will respond to you shortly.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setMessage(''); setSubject(''); }}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="w-14 h-14 rounded-xl gradient-teal flex items-center justify-center mx-auto mb-4 shadow-teal">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Login to Contact an Agent</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Please log in to send a message to one of our agents.
          </p>
          <Button onClick={login} disabled={loginStatus === 'logging-in'}>
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-xl">Send a Message</CardTitle>
        <CardDescription>Our agents typically respond within 24 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-filled user info */}
          {userProfile && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Your Name</Label>
                <Input value={userProfile.name} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label>Your Email</Label>
                <Input value={userProfile.email} disabled className="bg-muted/50" />
              </div>
            </div>
          )}

          {/* Agent Selector */}
          <div className="space-y-1.5">
            <Label>Select Agent *</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent..." />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.agentId} value={agent.agentId}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="contact-subject">Subject</Label>
            <Input
              id="contact-subject"
              placeholder="e.g., Question about health coverage"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Message *</Label>
            <Textarea
              id="contact-message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedAgentId || !message.trim() || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
