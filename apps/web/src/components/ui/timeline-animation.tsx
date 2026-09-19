import { type ElementType, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export interface TimelineContentProps {
  children: ReactNode;
  as?: ElementType;
  animationNum: number;
  timelineRef: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  // Pass-through for anchor/link props (href, target, rel, etc.)
  [key: string]: unknown;
}

/**
 * Scroll-reveal wrapper: renders `as` (any tag) as a motion element that
 * animates in when the shared `timelineRef` container enters the viewport,
 * staggered by `animationNum`.
 *
 * When the visitor asks for reduced motion, the content renders visible from
 * the start rather than animating. That is the accessible behaviour, and it
 * also makes the page safe to prerender: the build snapshots with reduced
 * motion emulated, so the HTML contains real content instead of a tree of
 * elements still sitting at opacity 0 waiting for a scroll that never comes.
 */
export function TimelineContent({
  children,
  as = 'div',
  animationNum,
  timelineRef,
  customVariants,
  className,
  ...rest
}: TimelineContentProps) {
  const MotionTag = motion(as as ElementType);
  const reduceMotion = useReducedMotion();
  const inView = useInView(timelineRef, {
    once: true,
    margin: '0px 0px -8% 0px',
  });

  const show = reduceMotion || inView;

  return (
    <MotionTag
      custom={animationNum}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate={show ? 'visible' : 'hidden'}
      variants={customVariants ?? defaultVariants}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
