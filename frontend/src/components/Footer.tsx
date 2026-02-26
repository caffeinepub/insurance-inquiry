import { Link } from '@tanstack/react-router';
import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'securelife-insurance');

  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-mid flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-background">SecureLife Insurance</span>
            </div>
            <p className="text-sm text-background/60 max-w-xs leading-relaxed">
              Protecting what matters most. Get personalized insurance coverage tailored to your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-background/60 hover:text-background transition-colors">Get a Quote</Link></li>
              <li><Link to="/plans" className="text-background/60 hover:text-background transition-colors">Browse Plans</Link></li>
              <li><Link to="/contact" className="text-background/60 hover:text-background transition-colors">Contact an Agent</Link></li>
            </ul>
          </div>

          {/* Insurance Types */}
          <div>
            <h4 className="font-semibold text-background mb-3 text-sm uppercase tracking-wider">Coverage</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-background/60">Health Insurance</li>
              <li className="text-background/60">Auto Insurance</li>
              <li className="text-background/60">Life Insurance</li>
              <li className="text-background/60">Home Insurance</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <span>© {year} SecureLife Insurance. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-light hover:text-background transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
