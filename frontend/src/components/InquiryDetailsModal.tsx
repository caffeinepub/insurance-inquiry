import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { type InsuranceInquiry, InsuranceType, InquiryStatus } from '../backend';
import { useUpdateInquiryStatus } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Calendar, Tag, User } from 'lucide-react';

interface InquiryDetailsModalProps {
  inquiry: InsuranceInquiry | null;
  onClose: () => void;
}

const typeLabels: Record<InsuranceType, string> = {
  [InsuranceType.health]: 'Health Insurance',
  [InsuranceType.auto]: 'Auto Insurance',
  [InsuranceType.life]: 'Life Insurance',
  [InsuranceType.home]: 'Home Insurance',
};

const statusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  [InquiryStatus.pending]: { label: 'Pending', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
  [InquiryStatus.inReview]: { label: 'In Review', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  [InquiryStatus.resolved]: { label: 'Resolved', className: 'bg-success/15 text-success border-success/30' },
};

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function InquiryDetailsModal({ inquiry, onClose }: InquiryDetailsModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateInquiryStatus();

  if (!inquiry) return null;

  const handleStatusChange = (newStatus: string) => {
    updateStatus(
      { inquiryId: inquiry.inquiryId, status: newStatus as InquiryStatus },
      {
        onSuccess: () => toast.success('Status updated successfully'),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const statusCfg = statusConfig[inquiry.status];
  const detailLines = inquiry.details.split('\n').filter(Boolean);

  return (
    <Dialog open={!!inquiry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Inquiry Details</DialogTitle>
          <DialogDescription className="font-mono text-xs">{inquiry.inquiryId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="w-4 h-4" />
              <span>{typeLabels[inquiry.insuranceType]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(inquiry.timestamp)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
              <User className="w-4 h-4" />
              <span className="font-mono text-xs">{inquiry.user.toString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant="outline" className={`text-xs ${statusCfg.className}`}>{statusCfg.label}</Badge>
          </div>

          <Separator />

          {/* Details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Inquiry Details</h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
              {detailLines.length > 0 ? (
                detailLines.map((line, i) => (
                  <p key={i} className="text-sm text-foreground">{line}</p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No details provided</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Status Update */}
          <div className="space-y-2">
            <Label>Update Status</Label>
            <div className="flex gap-2">
              <Select value={inquiry.status} onValueChange={handleStatusChange} disabled={isPending}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([status, cfg]) => (
                    <SelectItem key={status} value={status}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isPending && (
                <div className="flex items-center px-3">
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
