import { cn } from '@/lib/utils';

export type AuthMode = 'email' | 'phone';

/** Email / Phone switch at the top of the login and sign-up forms. */
export default function AuthTabs({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  const tabs: { id: AuthMode; label: string }[] = [
    { id: 'email', label: 'Email Address' },
    { id: 'phone', label: 'Phone Number' },
  ];

  return (
    <div role="tablist" aria-label="Sign-in method" className="mt-6 flex items-start gap-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={mode === t.id}
          onClick={() => onChange(t.id)}
          className="text-left"
        >
          <span
            className={cn(
              'text-[15px] transition-colors',
              mode === t.id ? 'font-semibold text-[#131316]' : 'text-[#8a8a8e] hover:text-[#131316]',
            )}
          >
            {t.label}
          </span>
          <div
            className={cn(
              'mt-2 h-[2px] w-full rounded-full transition-colors',
              mode === t.id ? 'bg-[#131316]' : 'bg-transparent',
            )}
          />
        </button>
      ))}
    </div>
  );
}
