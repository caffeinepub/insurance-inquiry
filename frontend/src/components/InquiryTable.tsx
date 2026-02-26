import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { type InsuranceInquiry, InsuranceType, InquiryStatus } from '../backend';
import { Eye, Filter } from 'lucide-react';

interface InquiryTableProps {
  inquiries: InsuranceInquiry[];
  isLoading: boolean;
  onViewDetails: (inquiry: InsuranceInquiry) => void;
}

const typeLabels: Record<InsuranceType, string> = {
  [InsuranceType.health]: 'Health',
  [InsuranceType.auto]: 'Auto',
  [InsuranceType.life]: 'Life',
  [InsuranceType.home]: 'Home',
};

const statusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  [InquiryStatus.pending]: { label: 'Pending', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
  [InquiryStatus.inReview]: { label: 'In Review', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  [InquiryStatus.resolved]: { label: 'Resolved', className: 'bg-success/15 text-success border-success/30' },
};

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function truncatePrincipal(principal: { toString(): string }): string {
  const str = principal.toString();
  return str.length > 12 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
}

export default function InquiryTable({ inquiries, isLoading, onViewDetails }: InquiryTableProps) {
  const [typeFilter, setTypeFilter] = useState<InsuranceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');

  const filtered = inquiries.filter((inq) => {
    const typeMatch = typeFilter === 'all' || inq.insuranceType === typeFilter;
    const statusMatch = statusFilter === 'all' || inq.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as InsuranceType | 'all')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(typeLabels).map(([type, label]) => (
              <SelectItem key={type} value={type}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as InquiryStatus | 'all')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([status, cfg]) => (
              <SelectItem key={status} value={status}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} inquiries</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inquiry) => {
                const statusCfg = statusConfig[inquiry.status];
                return (
                  <TableRow key={inquiry.inquiryId} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{inquiry.inquiryId.slice(0, 12)}...</TableCell>
                    <TableCell className="font-mono text-xs">{truncatePrincipal(inquiry.user)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{typeLabels[inquiry.insuranceType]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(inquiry.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusCfg.className}`}>{statusCfg.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails(inquiry)} className="gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
