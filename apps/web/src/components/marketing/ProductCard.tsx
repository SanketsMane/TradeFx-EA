import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/catalog';

/**
 * Product tile used on the home page and the Expert Advisors index.
 * Deliberately price-free — the only CTA is into the detail page.
 */
export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg',
        className,
      )}
    >
      <div className="relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white px-6">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent blur-2xl',
            product.accent.glow,
          )}
        />
        <img
          src={product.cardImage}
          alt={`${product.name} Expert Advisor`}
          width={product.cardSize.w}
          height={product.cardSize.h}
          loading="lazy"
          decoding="async"
          className="relative h-52 w-auto object-contain object-bottom drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-gray-100 p-5">
        <span
          className={cn(
            'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1',
            product.accent.chip,
          )}
        >
          {product.tag}
        </span>
        <h3 className="mt-3 text-lg font-bold text-gray-900">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">{product.summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="truncate pr-2 text-xs font-medium text-gray-500">{product.platform}</span>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-brand-700">
            View details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
