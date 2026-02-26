import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { type ContactMessage, type Agent as BackendAgent } from '../backend';
import { MessageSquare } from 'lucide-react';

interface ContactMessagesTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  agents: BackendAgent[];
}

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function truncatePrincipal(principal: { toString(): string }): string {
  const str = principal.toString();
  return str.length > 12 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
}

export default function ContactMessagesTable({ messages, isLoading, agents }: ContactMessagesTableProps) {
  const agentMap = Object.fromEntries(agents.map((a) => [a.agentId, a.name]));

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Sender</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Message Preview</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                  <span>No messages yet</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow key={msg.messageId} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs">{truncatePrincipal(msg.sender)}</TableCell>
                <TableCell className="text-sm">{agentMap[msg.agentId] || msg.agentId}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(msg.timestamp)}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs">
                  <span className="truncate block">{msg.message.slice(0, 80)}{msg.message.length > 80 ? '...' : ''}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
