'use client';

import React, { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  play?: boolean;
  lineBreakBefore?: number;
  renderWord?: (word: string, index: number) => ReactNode;
}

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.35,
  play = true,
  lineBreakBefore,
  renderWord,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const shouldPlay = inView && play;
  const words = animateBy === 'words' ? text.split(' ') : text.split('');
  const startY = direction === 'top' ? -20 : 20;

  useEffect(() => {
    if (reduceMotion) {
      setInView(true);
      return;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.unobserve(element);
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion, rootMargin, threshold]);

  return (
    <span
      ref={ref}
      role="text"
      aria-label={text}
      className={`flex flex-wrap justify-center ${className}`}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          {lineBreakBefore === index ? (
            <span aria-hidden="true" className="h-0 basis-full" />
          ) : null}
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            style={{
              marginRight:
                animateBy === 'words' &&
                index < words.length - 1 &&
                (lineBreakBefore === undefined || index !== lineBreakBefore - 1)
                  ? '0.22em'
                  : undefined,
            }}
            initial={reduceMotion ? false : { filter: 'blur(10px)', opacity: 0, y: startY }}
            animate={
              reduceMotion || shouldPlay
                ? {
                    filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                    opacity: [0, 0.5, 1],
                    y: [startY, direction === 'top' ? 2 : -2, 0],
                  }
                : { filter: 'blur(10px)', opacity: 0, y: startY }
            }
            transition={{
              duration: reduceMotion ? 0 : stepDuration * 2,
              times: [0, 0.5, 1],
              delay: reduceMotion ? 0 : (index * delay) / 1000,
              ease: 'easeOut',
            }}
          >
            {renderWord && animateBy === 'words' ? renderWord(word, index) : word}
          </motion.span>
        </Fragment>
      ))}
    </span>
  );
}
