import { useState } from 'react';
import AdminGuard from '../components/AdminGuard';
import InquiryTable from '../components/InquiryTable';
import InquiryDetailsModal from '../components/InquiryDetailsModal';
import ContactMessagesTable from '../components/ContactMessagesTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllInsuranceInquiries, useGetAllContactMessages, useGetAllAgents } from '../hooks/useQueries';
import { type InsuranceInquiry, InquiryStatus } from '../backend';
import { ClipboardList, MessageSquare, Clock, CheckCircle, Search } from 'lucide-react';

function DashboardContent() {
  const [selectedInquiry, setSelectedInquiry] = useState<InsuranceInquiry | null>(null);
  const { data: inquiries = [], isLoading: inquiriesLoading } = useGetAllInsuranceInquiries();
  const { data: messages = [], isLoading: messagesLoading } = useGetAllContactMessages();
  const { data: agents = [] } = useGetAllAgents();

  const pendingCount = inquiries.filter((i) => i.status === InquiryStatus.pending).length;
  const inReviewCount = inquiries.filter((i) => i.status === InquiryStatus.inReview).length;
  const resolvedCount = inquiries.filter((i) => i.status === InquiryStatus.resolved).length;

  return (
    <div>
      {/* Page Header */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage insurance inquiries and contact messages.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Inquiries</span>
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{inquiries.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">In Review</span>
                <Search className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{inReviewCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inquiries">
          <TabsList className="mb-6">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Inquiries
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0 h-4">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
              {messages.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0 h-4">
                  {messages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg">Insurance Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <InquiryTable
                  inquiries={inquiries}
                  isLoading={inquiriesLoading}
                  onViewDetails={setSelectedInquiry}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactMessagesTable
                  messages={messages}
                  isLoading={messagesLoading}
                  agents={agents}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Inquiry Details Modal */}
      <InquiryDetailsModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
