'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import './GooeyNav.css';

export interface GooeyNavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  activeIndex: number;
  onActiveChange?: (index: number) => void;
  scrolled?: boolean;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
}

interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  duration: number;
  scale: number;
  rotate: number;
}

const BRAND_PARTICLE_COLORS = ['#123B8F', '#0B2D6B', '#E31B23', '#FFFFFF'];
const DEFAULT_PARTICLE_DISTANCES: [number, number] = [38, 6];
const DEFAULT_PARTICLE_COLORS = [1, 2, 3, 4];
const noise = (amount = 1) => amount / 2 - Math.random() * amount;

const getXY = (distance: number, index: number, count: number) => {
  const angle = ((360 + noise(8)) / count) * index * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)] as const;
};

const createParticle = (
  id: number,
  pointIndex: number,
  count: number,
  distances: [number, number],
  radius: number,
  colors: number[],
  animationTime: number,
  timeVariance: number,
): Omit<Particle, 'left' | 'top'> => {
  const start = getXY(distances[0], count - pointIndex, count);
  const end = getXY(distances[1] + noise(7), count - pointIndex, count);
  const rotation = noise(radius / 10);
  const colorIndex = colors[Math.floor(Math.random() * colors.length)] ?? 4;

  return {
    id,
    startX: start[0],
    startY: start[1],
    endX: end[0],
    endY: end[1],
    color: BRAND_PARTICLE_COLORS[colorIndex - 1] ?? BRAND_PARTICLE_COLORS[3],
    duration: animationTime + Math.random() * timeVariance,
    scale: 0.75 + Math.random() * 0.45,
    rotate: (rotation >= 0 ? rotation + radius / 20 : rotation - radius / 20) * 10,
  };
};

export default function GooeyNav({
  items,
  activeIndex,
  onActiveChange,
  scrolled = false,
  animationTime = 520,
  particleCount = 7,
  particleDistances = DEFAULT_PARTICLE_DISTANCES,
  particleR = 70,
  timeVariance = 180,
  colors = DEFAULT_PARTICLE_COLORS,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const previousIndex = useRef(activeIndex);
  const nextParticleId = useRef(0);
  const currentPosition = useRef<Position | null>(null);
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState<Position | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const updateEffectPosition = () => {
      const container = containerRef.current;
      const activeItem = navRef.current?.querySelector<HTMLAnchorElement>(`[data-nav-index="${activeIndex}"]`);
      if (!container || !activeItem) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const nextPosition = {
        left: itemRect.left - containerRect.left,
        top: itemRect.top - containerRect.top,
        width: itemRect.width,
        height: itemRect.height,
      };
      currentPosition.current = nextPosition;
      setPosition(nextPosition);
    };

    updateEffectPosition();

    const container = containerRef.current;
    if (!container) return;

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateEffectPosition);
      resizeObserver.observe(container);
      if (navRef.current) {
        resizeObserver.observe(navRef.current);
        navRef.current.querySelectorAll('a').forEach((item) => resizeObserver.observe(item));
      }
      return () => resizeObserver.disconnect();
    }

    window.addEventListener('resize', updateEffectPosition);
    return () => window.removeEventListener('resize', updateEffectPosition);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (previousIndex.current === activeIndex) return;
    previousIndex.current = activeIndex;

    const measuredPosition = currentPosition.current;
    if (reduceMotion || !measuredPosition || particleCount <= 0) {
      setParticles([]);
      return;
    }

    const originLeft = measuredPosition.left + measuredPosition.width / 2;
    const originTop = measuredPosition.top + measuredPosition.height / 2;
    const nextParticles = Array.from({ length: particleCount }, (_, index) => ({
      ...createParticle(nextParticleId.current++, index, particleCount, particleDistances, particleR, colors, animationTime, timeVariance),
      left: originLeft,
      top: originTop,
    }));

    setParticles(nextParticles);
    const cleanupTimer = window.setTimeout(() => setParticles([]), animationTime + timeVariance + 100);
    return () => window.clearTimeout(cleanupTimer);
  }, [
    activeIndex,
    animationTime,
    colors,
    particleCount,
    particleDistances,
    particleR,
    reduceMotion,
    timeVariance,
  ]);

  return (
    <div
      ref={containerRef}
      className={`gooey-nav-container${scrolled ? ' is-scrolled' : ''}${reduceMotion ? ' reduced-motion' : ''}`}
    >
      <nav aria-label="Main navigation" ref={navRef}>
        <ul>
          {items.map((item, index) => (
            <li key={item.sectionId} className={activeIndex === index ? 'active' : ''}>
              <a
                href={item.href}
                data-nav-index={index}
                aria-current={activeIndex === index ? 'page' : undefined}
                onClick={(event) => {
                  if (!onActiveChange) return;
                  event.preventDefault();
                  onActiveChange(index);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {position ? (
        <span
          aria-hidden="true"
          className="gooey-effect filter"
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
          }}
        >
          <span className="gooey-pill" />
        </span>
      ) : null}

      {particles.map((particle) => (
        <span
          aria-hidden="true"
          key={particle.id}
          className="gooey-particle"
          style={{
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}ms`,
            '--start-x': `${particle.startX}px`,
            '--start-y': `${particle.startY}px`,
            '--end-x': `${particle.endX}px`,
            '--end-y': `${particle.endY}px`,
            '--particle-scale': particle.scale,
            '--particle-rotate': `${particle.rotate}deg`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
