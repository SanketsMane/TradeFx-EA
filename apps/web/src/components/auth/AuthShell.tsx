import { type ReactNode } from 'react';
import FloatingTelegram from '@/components/marketing/FloatingTelegram';
import { Globe } from 'lucide-react';

/**
 * Shared chrome for the public auth pages (login, register): the dark
 * promotional panel on the left, the language pill, the support button, and a
 * centered slot for the form on the right.
 *
 * Type and spacing follow the reference at 1x (the source screenshot is a 2x
 * retina capture of a ~1210px-wide window), so sizes here are deliberately
 * compact — scaling them up is what makes an auth page look amateurish.
 */
const DEVICE_IMAGE = '/auth-device.webp';

/**
 * Percent-of-panel box for the artwork, with the bottom intentionally cropped
 * by the panel. These numbers place the *handset*, not the image file: the
 * current cut-out sits at 11.56% from its own left edge and is 78.11% of the
 * file's width, which lands the phone at ~17.8% / 52% / 56% of the panel to
 * match the reference. Swap the file and re-derive them from its alpha bounds.
 */
const DEVICE_BOX = { left: '9.5%', top: '51.6%', width: '71.6%' };

/** Black at the top lifting into blue-grey, with a soft glow behind the device. */
const PANEL_BACKGROUND = [
  'radial-gradient(60% 45% at 38% 88%, rgba(160,175,190,0.45) 0%, rgba(160,175,190,0) 70%)',
  'linear-gradient(to bottom, #000000 0%, #000000 42%, #0c1219 58%, #333d49 78%, #828c96 100%)',
].join(', ');

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* ---------- Left: promotional panel ---------- */}
      <div className="hidden p-3 lg:block lg:w-[50%]">
        <div
          className="relative h-full overflow-hidden rounded-2xl"
          style={{ backgroundImage: PANEL_BACKGROUND }}
        >
          {/* device render — transparent cut-out, shadow baked into the asset */}
          <img
            src={DEVICE_IMAGE}
            alt=""
            draggable={false}
            /* the panel is `hidden` under lg, so mobile never fetches this */
            loading="lazy"
            decoding="async"
            className="absolute select-none"
            style={DEVICE_BOX}
          />

          {/* brand lockup */}
          <div className="absolute left-10 top-10 flex items-center gap-2">
            <img src="/logo-light.webp" alt="TradeFx" className="h-7 w-auto object-contain" />
          </div>

          {/* marketing copy */}
          <div className="absolute inset-x-0 top-[26%] px-6 text-center">
            <h2 className="text-[35px] font-bold leading-[1.1] tracking-tight text-white">
              Trade Fast and Smart
            </h2>
            <p className="mx-auto mt-6 max-w-[480px] text-[18px] font-bold leading-snug tracking-tight text-white">
              Driving Excellence with a Leading CFD Trading Platform
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Right: form column ---------- */}
      <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-20 sm:px-10">
        <button
          type="button"
          className="absolute right-8 top-12 inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#f4f4f5] px-4 text-[14px] text-[#131316] transition-colors hover:bg-[#ebebec]"
        >
          <Globe className="h-4 w-4" strokeWidth={1.75} />
          English
        </button>

        <main className="w-full max-w-[344px]">{children}</main>
      </div>

      <FloatingTelegram />
    </div>
  );
}
