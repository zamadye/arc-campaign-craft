import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VERIFIED_DOMAIN = 'app-intent.lovable.app';
const VERIFIED_URL = `https://${VERIFIED_DOMAIN}`;

/**
 * Preview Mode Warning Banner
 * 
 * Displayed when the user is on a preview/staging URL instead of the verified domain.
 * Helps prevent phishing warnings by directing users to the canonical domain.
 */
export const PreviewModeWarning: React.FC = () => {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const isVerifiedDomain = currentDomain === VERIFIED_DOMAIN;
  
  // Don't show warning on verified domain
  if (isVerifiedDomain) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-yellow-500/10 border-b border-yellow-500/30"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
          <span className="text-yellow-500/90">
            Preview environment.
          </span>
          <a 
            href={VERIFIED_URL} 
            className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 underline underline-offset-2 transition-colors"
          >
            Use verified domain
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewModeWarning;
