import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubmitInsuranceInquiry } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { InsuranceType } from '../backend';
import { toast } from 'sonner';
import { CheckCircle, Heart, Car, Users, Home, ChevronRight } from 'lucide-react';

interface InsuranceInquiryFormProps {
  preselectedType?: InsuranceType;
  preselectedPlan?: string;
}

const insuranceTypeConfig = {
  [InsuranceType.health]: {
    label: 'Health Insurance',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    fields: ['Age', 'Number of dependents', 'Pre-existing conditions', 'Preferred coverage amount'],
  },
  [InsuranceType.auto]: {
    label: 'Auto Insurance',
    icon: Car,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    fields: ['Vehicle make & model', 'Year of manufacture', 'Current mileage', 'Driving history'],
  },
  [InsuranceType.life]: {
    label: 'Life Insurance',
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    fields: ['Age', 'Occupation', 'Coverage amount desired', 'Beneficiary information'],
  },
  [InsuranceType.home]: {
    label: 'Home Insurance',
    icon: Home,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    fields: ['Property address', 'Property type', 'Year built', 'Estimated property value'],
  },
};

export default function InsuranceInquiryForm({ preselectedType, preselectedPlan }: InsuranceInquiryFormProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [selectedType, setSelectedType] = useState<InsuranceType | ''>(preselectedType || '');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitInquiry, isPending } = useSubmitInsuranceInquiry();

  const config = selectedType ? insuranceTypeConfig[selectedType] : null;

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildDetailsString = () => {
    const parts: string[] = [];
    if (preselectedPlan) parts.push(`Plan: ${preselectedPlan}`);
    if (config) {
      config.fields.forEach((field) => {
        if (formData[field]) parts.push(`${field}: ${formData[field]}`);
      });
    }
    if (additionalNotes) parts.push(`Additional notes: ${additionalNotes}`);
    return parts.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const details = buildDetailsString();
    submitInquiry(
      { insuranceType: selectedType, details },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success('Inquiry submitted successfully!');
        },
        onError: (err) => {
          toast.error('Failed to submit inquiry. Please try again.');
          console.error(err);
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
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Inquiry Submitted!</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Thank you for your inquiry. One of our agents will review it and get back to you shortly.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setFormData({});
              setAdditionalNotes('');
              setSelectedType(preselectedType || '');
            }}
          >
            Submit Another Inquiry
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
            <ChevronRight className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Login to Submit an Inquiry</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Please log in to submit an insurance inquiry and track your requests.
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
        <CardTitle className="font-display text-xl">Insurance Inquiry Form</CardTitle>
        <CardDescription>Fill in the details below and we'll connect you with the right coverage.</CardDescription>
        {preselectedPlan && (
          <Badge variant="secondary" className="w-fit mt-1">
            Plan: {preselectedPlan}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Insurance Type Selector */}
          <div className="space-y-2">
            <Label>Insurance Type *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(insuranceTypeConfig).map(([type, cfg]) => {
                const Icon = cfg.icon;
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setSelectedType(type as InsuranceType); setFormData({}); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      isSelected
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : cfg.color}`} />
                    <span className="text-xs leading-tight text-center">{cfg.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Fields */}
          {config && (
            <div className="space-y-4 animate-fade-in">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${config.bg}`}>
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium text-foreground">{config.label} Details</span>
              </div>
              {config.fields.map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={`field-${field}`}>{field}</Label>
                  <Input
                    id={`field-${field}`}
                    placeholder={`Enter ${field.toLowerCase()}`}
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Additional Notes */}
          {selectedType && (
            <div className="space-y-1.5 animate-fade-in">
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional information or specific requirements..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedType || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Inquiry'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
