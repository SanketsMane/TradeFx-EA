import { useEffect, useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatLicenseCode } from '@/lib/portalData';

/**
 * The 9-character licence code with a copy button. Displayed in groups of
 * three for readability; what lands on the clipboard is the raw code, since
 * that is what the link-account form expects.
 */
export default function LicenseCode({
  code,
  className,
  size = 'md',
}: {
  code: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* clipboard blocked (insecure origin or denied) — the code is on screen anyway */
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 font-mono tracking-[0.12em] text-gray-900',
        size === 'sm' ? 'py-1 pl-2.5 pr-1 text-xs' : 'py-1.5 pl-3 pr-1.5 text-sm',
        className,
      )}
    >
      <span>{formatLicenseCode(code)}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Licence code copied' : 'Copy licence code'}
        title="Copy licence code"
        className={cn(
          'grid place-content-center rounded-md transition-colors',
          size === 'sm' ? 'h-5 w-5' : 'h-6 w-6',
          copied ? 'text-emerald-600' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700',
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
