'use client';

import { motion, useReducedMotion } from 'motion/react';

const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/DdjPR9kv4KS/',
  'https://www.instagram.com/p/DdvRlTqI84k/',
  'https://www.instagram.com/p/Dd1I3WfP4zZ/',
  'https://www.instagram.com/p/Ddq45uEhOl_/',
  'https://www.instagram.com/p/DeCJwBLuqDO/',
  'https://www.instagram.com/p/DeCdVPxP_9z/',
  'https://www.instagram.com/p/Dd893jyMtsZ/',
  'https://www.instagram.com/p/Dd-4kdWSb94/',
  'https://www.instagram.com/p/DdI-Ca1RFKJ/',
  'https://www.instagram.com/p/Dd9MUyYoFtb/',
  'https://www.instagram.com/reel/DdBvlZOyyjq/',
];

export default function Gallery() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#eff4ff]/60 py-16 lg:py-24 border-b border-slate-200" id="gallery">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-10 flex justify-center text-center">
          <motion.div
            className="flex max-w-3xl flex-col items-center gap-2"
            initial={reduceMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}
          >
            <motion.div className="inline-flex items-center gap-2" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
              <span className="w-2.5 h-1 bg-[#bb0013] rounded-full" />
              <span className="text-[11px] font-extrabold text-[#002069] tracking-widest uppercase">
              ACTIVITIES
              </span>
            </motion.div>

            <motion.h2 variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }} className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0b1c30] tracking-tight">
              Ways our community connects, learns, and grows.
            </motion.h2>

            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }} className="text-base text-slate-600">
              Explore the meeting formats, learning sessions, and local business activities described by the Manjeri chapter.
            </motion.p>
          </motion.div>

        </div>

        <div aria-label="Instagram videos" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {INSTAGRAM_POSTS.map((postUrl, index) => {
            const postPath = new URL(postUrl).pathname.replace(/\/$/, '');
            return (
              <article key={postUrl} className={`h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(0,32,105,0.09)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,32,105,0.16)] ${index >= 5 ? 'hidden sm:block' : ''}`}>
                <iframe
                  src={`https://www.instagram.com${postPath}/embed`}
                  title={`Instagram video ${index + 1} from Edge India and its community`}
                  loading="lazy"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  className="block h-full min-h-[540px] w-full overflow-hidden border-0 bg-white"
                />
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
