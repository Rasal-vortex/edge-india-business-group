'use client';

import React, { useEffect, useRef } from 'react';
import { animate, createTimeline, onScroll, stagger, svg } from 'animejs';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cleanups: Array<() => void> = [];
    const centerThresholds = {
      axis: 'y' as const,
      enter: 'center+=72 center',
      leave: 'center-=72 center',
      sync: 0.25,
      debug: false,
    };

    const plane = section.querySelector<SVGSVGElement>('[data-about-paper-plane]');
    const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-about-step]'));
    if (plane && steps.length > 0) {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const scrollRange = Math.max(1, section.clientHeight - window.innerHeight);
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const centeredStepProgress = (step: HTMLElement) =>
        clamp((step.getBoundingClientRect().top - sectionTop + step.offsetHeight / 2 - window.innerHeight / 2) / scrollRange);
      const duration = 3000;
      const guideWidth = section.clientWidth;
      const guideHeight = section.clientHeight;
      const points = steps.map((step, index) => {
        const badge = step.querySelector<HTMLElement>('[data-about-step-badge]') ?? step;
        const rect = badge.getBoundingClientRect();
        return {
          x: index % 2 === 0 ? guideWidth * 0.94 : guideWidth * 0.06,
          y: rect.top + rect.height / 2 - sectionRect.top,
          progress: centeredStepProgress(badge),
        };
      });
      const guide = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      guide.setAttribute('viewBox', `0 0 ${guideWidth} ${guideHeight}`);
      guide.setAttribute('aria-hidden', 'true');
      guide.classList.add('hidden', 'md:block');
      guide.style.cssText = `position:absolute;left:0;top:0;width:${guideWidth}px;height:${guideHeight}px;overflow:visible;opacity:1;pointer-events:none;z-index:0;`;
      section.appendChild(guide);

      // Keep the flight route in the outer side margins, separate from the center roadmap line.
      plane.style.opacity = '0';
      const planeVisual = plane.querySelector<SVGGElement>('[data-about-plane-visual]');
      const planeTimeline = createTimeline({ autoplay: false });

      points.slice(0, -1).forEach((point, index) => {
        const next = points[index + 1];
        const stageStart = point.progress * duration;
        const stageEnd = next.progress * duration;
        const span = Math.max(1, next.y - point.y);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${point.x} ${point.y} C ${point.x} ${point.y + span * 0.38}, ${next.x} ${point.y + span * 0.62}, ${next.x} ${next.y}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#12358f');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-opacity', '0.38');
        path.setAttribute('stroke-dasharray', '8 9');
        path.setAttribute('stroke-linecap', 'round');
        guide.appendChild(path);

        planeTimeline.add(plane, {
          ...svg.createMotionPath(path),
          duration: Math.max(1, stageEnd - stageStart),
          ease: 'linear',
        }, stageStart);

        if (planeVisual) {
          const stageDuration = Math.max(1, stageEnd - stageStart);
          const bank = index % 2 === 0 ? -6 : 6;
          planeTimeline.add(planeVisual, {
            rotate: [0, bank, 0],
            translateY: [0, -2, 0, 2, 0],
            duration: stageDuration,
            ease: 'linear',
          }, stageStart);
        }
      });

      if (points.length > 1) {
        const firstTime = points[0].progress * duration;
        const lastTime = points[points.length - 1].progress * duration;
        planeTimeline.add(plane, { opacity: [0, 1], duration: 120, ease: 'linear' }, firstTime);
        planeTimeline.add(plane, { opacity: [1, 0], duration: 120, ease: 'linear' }, Math.max(firstTime, lastTime - 120));
      }

      const planeObserver = onScroll({
        target: section,
        axis: 'y',
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
        debug: false,
        onUpdate: (observer) => planeTimeline.seek(observer.progress * duration),
      });

      cleanups.push(
        () => planeTimeline.revert(),
        () => planeObserver.revert(),
        () => guide.remove(),
      );
    }

    const heading = section.querySelector<HTMLElement>('[data-about-heading-reveal]');
    const headingCharacters = heading?.querySelectorAll<HTMLElement>('[data-about-heading-char]');
    if (heading && headingCharacters?.length) {
      const description = section.querySelector<HTMLElement>('[data-about-heading-description]');
      const observer = onScroll({
        target: heading,
        axis: 'y',
        enter: 'bottom bottom',
        leave: 'top top',
        sync: 0.25,
        debug: false,
      });
      const animatedHeadingTargets: HTMLElement[] = Array.from(headingCharacters);
      if (description) animatedHeadingTargets.push(description);
      const animation = animate(animatedHeadingTargets, {
        opacity: [0, 1],
        y: [18, 0],
        scaleY: [0.94, 1],
        transformOrigin: '50% 100%',
        duration: 900,
        delay: stagger(30),
        ease: 'out(3)',
        autoplay: observer,
      });
      cleanups.push(() => animation.revert(), () => observer.revert());
    }

    const horizontalOffset = window.matchMedia('(max-width: 639px)').matches ? 36 : 72;
    section.querySelectorAll<HTMLElement>('[data-about-step]').forEach((step, index) => {
      const text = step.querySelector<HTMLElement>('[data-about-step-text]');
      const badge = step.querySelector<HTMLElement>('[data-about-step-badge]');
      if (!text || !badge) return;

      const observer = onScroll({ target: step, ...centerThresholds });
      const timeline = createTimeline({ autoplay: observer });
      const fromX = index % 2 === 0 ? -horizontalOffset : horizontalOffset;

      timeline
        .add(text, { opacity: [0, 1], x: [fromX, 0], duration: 1000, ease: 'linear' }, 0)
        .add(badge, { opacity: [0, 1], scale: [0.82, 1], duration: 1000, ease: 'linear' }, 0);

      cleanups.push(() => timeline.revert(), () => observer.revert());
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-clip border-b border-slate-200/80 bg-[#eff4ff]/60 py-16 lg:py-24"
      id="about"
    >
      <svg
        data-about-paper-plane
        aria-hidden="true"
        viewBox="0 0 48 48"
        fill="none"
        className="pointer-events-none absolute left-0 top-0 z-20 -ml-20 -mt-20 hidden h-40 w-40 md:block motion-reduce:hidden"
      >
        <g data-about-plane-visual style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <image href="/paper-plane-realistic.webp" x="-12" y="0" width="72" height="48" preserveAspectRatio="none" />
        </g>
      </svg>
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">
        <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-2 text-center sm:mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">
              WHO WE ARE
            </span>
          </div>

          <h2 data-about-heading-reveal className="w-full text-center text-3xl font-extrabold tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[40px]">
            <span className="sr-only">Business. Community. Growth.</span>
            <span aria-hidden="true">
              {['Business.', 'Community.', 'Growth.'].map((word, wordIndex) => (
                <React.Fragment key={word}>
                  {wordIndex > 0 ? ' ' : null}
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((character, characterIndex) => (
                      <span
                        key={`${word}-${characterIndex}`}
                        data-about-heading-char
                        className="inline-block motion-safe:opacity-0"
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                </React.Fragment>
              ))}
            </span>
          </h2>

          <p data-about-heading-description className="w-full text-center text-base leading-relaxed text-slate-600 sm:text-lg">
            EDGE India Manjeri connects entrepreneurs, professionals, and business leaders in a local community focused on trusted relationships, collaboration, learning, and growth.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div aria-hidden="true" className="absolute bottom-8 left-5 top-8 w-px bg-[#002069]/15 sm:left-1/2 sm:-translate-x-1/2" />
          <div className="space-y-6 md:space-y-16">
            <div data-about-step className="relative grid min-h-0 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 py-8 md:min-h-[100svh] md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-x-4 md:py-0 md:pt-[32vh]">
              <div className="col-start-1 row-start-1 hidden sm:block" />
              <span data-about-step-badge aria-hidden="true" className="z-10 col-start-1 row-start-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#002069] bg-white text-sm font-extrabold text-[#002069] shadow-sm sm:col-start-2 sm:mx-auto">01</span>
              <div
                data-about-step-text
                className="col-start-2 row-start-1 py-2 sm:col-start-1 sm:pr-7"
              >
                <div className="w-full text-left">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0b1c30] sm:text-[28px]">Trusted Networking</h3>
                  <p className="mt-3 block max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Building trusted business relationships among entrepreneurs, professionals, and business leaders in Manjeri.
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                  <p>• A local space to meet and build business connections.</p>
                  <p>• Opportunities to find reliable partners and collaborate.</p>
                  <p>• Community based in Manjeri, Kerala.</p>
                </div>
              </div>
            </div>

            <div data-about-step className="relative grid min-h-0 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 py-8 md:min-h-[100svh] md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-x-4 md:py-0 md:pt-[32vh]">
              <div className="col-start-1 row-start-1 hidden sm:block" />
              <span data-about-step-badge aria-hidden="true" className="z-10 col-start-1 row-start-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#bb0013] bg-white text-sm font-extrabold text-[#bb0013] shadow-sm sm:col-start-2 sm:mx-auto">02</span>
              <div
                data-about-step-text
                className="col-start-2 row-start-1 py-2 sm:col-start-3 sm:pl-7"
              >
                <div className="w-full text-left">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0b1c30] sm:text-[28px]">Learning Through Meetings</h3>
                  <p className="mt-3 block max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Meetups, training sessions, and expert talks give local business people opportunities to share knowledge and learn from one another.
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                  <p>• Business Evolution Meetings and Business Acceleration sessions.</p>
                  <p>• Learner’s Meetings on practical business topics.</p>
                  <p>• AI sessions featuring Sainudheen Kaderi, co-founder of Coyot AI.</p>
                </div>
              </div>
            </div>

            <div data-about-step className="relative grid min-h-0 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 py-8 md:min-h-[100svh] md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-x-4 md:py-0 md:pt-[32vh]">
              <div className="col-start-1 row-start-1 hidden sm:block" />
              <span data-about-step-badge aria-hidden="true" className="z-10 col-start-1 row-start-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#002069] bg-white text-sm font-extrabold text-[#002069] shadow-sm sm:col-start-2 sm:mx-auto">03</span>
              <div
                data-about-step-text
                className="col-start-2 row-start-1 py-2 sm:col-start-1 sm:pr-7"
              >
                <div className="w-full text-left">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0b1c30] sm:text-[28px]">Local Collaboration &amp; Growth</h3>
                  <p className="mt-3 block max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    The chapter encourages collaboration and helps bring attention to new ventures in the regional business community.
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                  <p>• Meetings can be held in person or online through Google Meet.</p>
                  <p>• The community supports local business initiatives.</p>
                  <p>• The profile records support for the Nashadz E-Commerce stock-launching ceremony.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

