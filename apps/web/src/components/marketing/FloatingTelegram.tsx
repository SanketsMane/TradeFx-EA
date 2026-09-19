import { Send } from 'lucide-react';
import { TELEGRAM_URL } from '@/lib/contact';

/**
 * Floating Telegram button, present on every public page and in the portal.
 * Telegram is where most enquiries actually arrive, so it stays reachable
 * without hunting for the contact page.
 */
export default function FloatingTelegram() {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with TradeFx on Telegram"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#2AABEE] py-3.5 pl-3.5 pr-3.5 text-white shadow-lg shadow-[#2AABEE]/30 transition-all hover:gap-2 hover:pr-5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2AABEE] focus-visible:ring-offset-2"
    >
      <Send className="h-5 w-5 shrink-0 -translate-x-px translate-y-px" />
      {/* Label unrolls on hover; hidden from pointer-less devices where it cannot. */}
      <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-200 group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
