import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const VERIFIED_DOMAIN = 'app-intent.lovable.app';

interface DomainVerificationBadgeProps {
  className?: string;
}

/**
 * Domain Verification Badge
 * 
 * Shows whether the user is on the verified production domain or a preview URL.
 * Helps users identify legitimate vs. potential phishing sites.
 */
export const DomainVerificationBadge: React.FC<DomainVerificationBadgeProps> = ({ className }) => {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const isVerifiedDomain = currentDomain === VERIFIED_DOMAIN;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
      isVerifiedDomain 
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
      className
    )}>
      {isVerifiedDomain ? (
        <>
          <ShieldCheck className="w-3 h-3" />
          <span className="hidden sm:inline">Verified Domain</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-3 h-3" />
          <span className="hidden sm:inline">Preview Mode</span>
        </>
      )}
    </div>
  );
};

export default DomainVerificationBadge;
