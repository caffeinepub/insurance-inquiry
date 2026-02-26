import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import InsuranceInquiryForm from '../components/InsuranceInquiryForm';
import { InsuranceType } from '../backend';
import { Shield, Clock, Award, Users } from 'lucide-react';

const trustStats = [
  { icon: Shield, label: 'Plans Available', value: '50+' },
  { icon: Users, label: 'Happy Clients', value: '10K+' },
  { icon: Award, label: 'Years Experience', value: '25+' },
  { icon: Clock, label: 'Avg Response Time', value: '< 24h' },
];

export default function HomePage() {
  const search = useSearch({ strict: false }) as { type?: string; plan?: string };
  const [preselectedType, setPreselectedType] = useState<InsuranceType | undefined>();
  const [preselectedPlan, setPreselectedPlan] = useState<string | undefined>();

  useEffect(() => {
    if (search.type && Object.values(InsuranceType).includes(search.type as InsuranceType)) {
      setPreselectedType(search.type as InsuranceType);
    }
    if (search.plan) {
      setPreselectedPlan(search.plan);
    }
  }, [search.type, search.plan]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Insurance protection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-3 py-1.5 rounded-full mb-4 border border-white/20">
              <Shield className="w-3.5 h-3.5" />
              Trusted Insurance Solutions
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight text-balance">
              Protect What Matters Most
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
              Get personalized insurance coverage for your health, auto, life, and home. 
              Submit an inquiry today and our experts will find the perfect plan for you.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border shadow-xs">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustStats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg leading-tight">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Get Your Free Quote
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Fill out our simple inquiry form and one of our licensed agents will prepare a personalized quote for you within 24 hours.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { step: '1', title: 'Choose Your Coverage', desc: 'Select the type of insurance you need' },
                { step: '2', title: 'Fill in Details', desc: 'Provide relevant information for accurate quotes' },
                { step: '3', title: 'Get Your Quote', desc: 'Our agents will contact you with personalized options' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center shrink-0 mt-0.5 shadow-teal">
                    <span className="text-white text-xs font-bold">{step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insurance type icons */}
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src="/assets/generated/insurance-icons.dim_512x128.png"
                alt="Insurance types: Health, Auto, Life, Home"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <InsuranceInquiryForm
              preselectedType={preselectedType}
              preselectedPlan={preselectedPlan}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
