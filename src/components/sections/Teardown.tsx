import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useAnimationControls,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Button from '../ui/Button';
import RevealText from '../ui/RevealText';
import FullStop from '../ui/FullStop';
import { scrollToSection } from '../../utils/smoothScroll';
import { EASE } from '../../utils/motion';
import {
  STAGE_W,
  STAGE_H,
  StorefrontLayer,
  MatchingLayer,
  DataLayer,
  TelegramLayer,
  RatingCard,
} from '../teardown/layers';

/*
 * "The Teardown" — the hero and the LionCity case study as one scroll story.
 * LionCity assembles itself beside the name; scrolling pins the stage, tilts
 * the product into an exploded stack, and pulls each layer out to face the
 * reader before slotting it back. It reassembles over the outcome. Native scroll only; reduced motion gets a
 * static stacked diagram with the same captions.
 */

const LIVE_URL = 'https://www.lioncitytutors.com/';
const REPO_URL = 'https://github.com/ivanfang-dev/lioncity-tutors';
const RESUME_URL = `${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`;

/* Choreography — fractions of the pinned scroll distance. */
const EXPLODE: [number, number] = [0.05, 0.13];
const REASSEMBLE: [number, number] = [0.79, 0.87];
const WINDOWS: [number, number][] = [
  [0.13, 0.29],
  [0.29, 0.45],
  [0.45, 0.61],
  [0.61, 0.79],
];
const OUTCOME_AT = 0.93;

/* Exploded-stack geometry, in stage design pixels. */
const TILT_X = 56;
const TILT_Z = -34;
const GAP = 24; // depth between layers
const SPREAD = 76; // on-screen vertical spacing, so each layer peeks out below the last
const EXPLODED_SCALE = 0.62;
const POPPED_SCALE = 0.88;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);

const explodeAt = (v: number) =>
  smooth(ramp(v, EXPLODE[0], EXPLODE[1])) * (1 - smooth(ramp(v, REASSEMBLE[0], REASSEMBLE[1])));

/** How far layer i is pulled out of the stack toward the reader. */
const popAt = (i: number, v: number) => {
  const [s, e] = WINDOWS[i];
  return smooth(ramp(v, s + 0.006, s + 0.05)) * (1 - smooth(ramp(v, e - 0.045, e - 0.006)));
};

/** Progress through layer i's own beat, for the art inside it. Completes by
 *  the middle of the beat, so it is fully drawn while the layer is out. */
const revealAt = (i: number, v: number) => {
  const [s, e] = WINDOWS[i];
  return ramp(v, s + 0.03, s + (e - s) * 0.5);
};

interface Beat {
  tab: string;
  label: string;
  title: string;
  body: string;
  note?: string;
}

// Every figure here is Ivan's own, supplied 2026-10-18. Update them together.
const BEATS: Beat[] = [
  {
    tab: 'Storefront',
    label: 'storefront',
    title: 'The storefront.',
    body: 'React and Next.js. About a month from nothing to a live site with three pages: the homepage, a tutor request form and tutor sign-up. Enough to start matching families.',
  },
  {
    tab: 'Matching',
    label: 'matching',
    title: 'Matched within 6 hours.',
    body: 'A request comes in, suitable tutors are messaged within a minute, and the shortlist reaches the family on WhatsApp. 100+ families matched in the last 3 months.',
  },
  {
    tab: 'Data',
    label: 'data',
    title: 'One API underneath.',
    body: 'Express and MongoDB behind every form. Requests, tutor profiles and matches live in one place, so the site, the matching and the bot all read the same data.',
  },
  {
    tab: 'Bot',
    label: 'telegram bot',
    title: '400+ tutors, run from Telegram.',
    body: 'Every new assignment is posted to our Telegram channel. Tutors tap Apply, name their rate and confirm in a bot I wrote, which also keeps their profiles up to date.',
    note: 'The stage shows a simulation of the real bot.',
  },
];

const TABS = [...BEATS.map((b) => b.tab), 'Outcome'];
const TAB_TARGETS = [...WINDOWS.map(([s, e]) => s + (e - s) * 0.5), OUTCOME_AT];

const PROOF = ['Founder · LionCity Tutors', "SDE Intern '26 · Amazon", 'CS · UCLA'];

/** Titles end in a period; give it the brand-blue terminal tic. */
const Titled: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.slice(0, -1)}
    <span className="text-ucla-blue">.</span>
  </>
);

/** Scales a fixed-size stage to fit its box. */
function useFitScale(pad = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / STAGE_W, height / STAGE_H) * pad);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pad]);
  return [ref, scale] as const;
}

const ArrowUpRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Shared copy blocks                                                  */
/* ------------------------------------------------------------------ */

const Identity: React.FC<{ animated: boolean; onSkip?: () => void }> = ({ animated, onSkip }) => (
  <div>
    <RevealText
      as="h1"
      text="Ivan Fang"
      split="words"
      trigger="load"
      className="text-hero text-ink"
      stagger={0.09}
      duration={0.9}
    />
    <RevealText
      as="p"
      text="I built this"
      suffix={<FullStop className="text-ucla-blue" delay={0.65} />}
      split="words"
      trigger="load"
      delay={animated ? 0.35 : 0}
      className="mt-2 text-display-3 text-ucla-blue"
      stagger={0.07}
      duration={0.8}
    />
    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Proof">
      {PROOF.map((item) => (
        <li
          key={item}
          className="rounded-full border border-hairline bg-white/70 px-3 py-1 text-sm font-medium text-ink-soft"
        >
          {item}
        </li>
      ))}
    </ul>
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
      <Button variant="primary" size="lg" magnetic href={RESUME_URL}>
        Resume
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <button
        type="button"
        onClick={onSkip ?? (() => scrollToSection('about'))}
        className="inline-flex min-h-11 items-center text-sm font-medium text-ink-soft underline decoration-hairline underline-offset-4 transition-colors hover:text-ink hover:decoration-ucla-blue"
      >
        Skip the story ↓
      </button>
    </div>
  </div>
);

const Caption: React.FC<{ beat: Beat }> = ({ beat }) => (
  <div>
    <h2 className="text-display-3 text-ink">
      <Titled text={beat.title} />
    </h2>
    <p className="mt-5 max-w-[34rem] text-body-large text-ink-soft">{beat.body}</p>
    {beat.note && <p className="mt-4 text-body-small text-ink-faint">{beat.note}</p>}
  </div>
);

const Fig: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <b className="font-[family-name:var(--font-display)] font-bold text-ink">{children}</b>
);

const Outcome: React.FC = () => (
  <div>
    <h2 className="text-display-3 text-ink">
      <Titled text="It’s live." />
    </h2>
    <p className="mt-5 max-w-[34rem] text-body-large text-ink-soft">
      <Fig>100+</Fig> families matched in the last 3 months, each within <Fig>6 hours</Fig>.{' '}
      <Fig>400+</Fig> tutors on the platform. <Fig>4.8★</Fig> from 29 Google reviews.
    </p>
    <div className="mt-7 flex flex-wrap gap-3">
      <Button variant="primary" size="lg" magnetic href={LIVE_URL}>
        Visit lioncitytutors.com
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="lg" href={REPO_URL}>
        Code
      </Button>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Pinned, scroll-driven version                                       */
/* ------------------------------------------------------------------ */

interface StagePose {
  explode: MotionValue<number>;
  pops: MotionValue<number>[];
}

const StackLayer: React.FC<{
  index: number;
  pose: StagePose;
  label: string;
  children: React.ReactNode;
}> = ({ index, pose, label, children }) => {
  const inputs = [pose.explode, ...pose.pops];
  const transform = useTransform(inputs, ([e, ...pops]: number[]) => {
    const t = pops[index];
    const k = e * (1 - t);
    const z = (3 - index) * GAP * k;
    const scale = (1 - (1 - EXPLODED_SCALE) * e) * (1 - t) + POPPED_SCALE * t;
    const y = ((index - 1.5) * SPREAD + 16) * k;
    return `translate3d(0px, ${y}px, ${70 * t}px) rotateX(${TILT_X * k}deg) rotateZ(${TILT_Z * k}deg) translateZ(${z}px) scale(${scale})`;
  });
  // Whatever is pulled out gets the stage; the rest of the stack dims behind it.
  const opacity = useTransform(pose.pops, (pops: number[]) =>
    1 - 0.88 * Math.max(0, ...pops.filter((_, j) => j !== index)),
  );
  const zIndex = useTransform(pose.pops[index], (t) => (t > 0.02 ? 20 : 10 - index));
  const labelOpacity = useTransform(inputs, ([e, ...pops]: number[]) => e * (1 - pops[index]));

  return (
    <motion.div
      className="absolute inset-0 rounded-[18px] shadow-[0_40px_70px_-30px_rgba(20,47,76,0.45)] will-change-transform"
      style={{ transform, opacity, zIndex }}
    >
      <motion.span
        className="absolute -top-11 left-1 whitespace-nowrap text-[22px] font-semibold text-ucla-blue"
        style={{ opacity: labelOpacity }}
      >
        {label}
      </motion.span>
      {children}
    </motion.div>
  );
};

/**
 * The stage's pose normally follows scroll. During a tab jump it's handed to
 * `held` values instead, so the stage can choreograph its own way to the new
 * beat while the page has already moved there.
 */
function useFollow(fromScroll: MotionValue<number>, held: MotionValue<number>, holding: MotionValue<number>) {
  return useTransform([fromScroll, held, holding], ([s, h, on]: number[]) => (on ? h : s));
}

const FadeBlock: React.FC<{
  progress: MotionValue<number>;
  input: number[];
  output: number[];
  interactiveFrom?: (v: number) => boolean;
  onFocusCapture?: () => void;
  children: React.ReactNode;
}> = ({ progress, input, output, interactiveFrom, onFocusCapture, children }) => {
  const opacity = useTransform(progress, input, output);
  const y = useTransform(opacity, [0, 1], [24, 0]);
  const pointerEvents = useTransform(progress, (v) => (interactiveFrom?.(v) ? 'auto' : 'none'));
  return (
    <motion.div
      className="[grid-area:1/1] self-center"
      style={{ opacity, y, pointerEvents }}
      onFocusCapture={onFocusCapture}
    >
      {children}
    </motion.div>
  );
};

const PinnedTeardown: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const [stageRef, scale] = useFitScale(0.96);

  // The entrance plays once on load; any scroll finishes it immediately.
  const [instant, setInstant] = useState(false);
  const [active, setActive] = useState(-1);

  const sync = (v: number) => {
    if (v > 0.004) setInstant(true);
    let next = -1;
    if (v >= REASSEMBLE[0]) next = 4;
    else if (v >= EXPLODE[1] - 0.03) next = Math.max(0, WINDOWS.findIndex(([s, e]) => v >= s && v < e));
    setActive(next);
  };
  useMotionValueEvent(progress, 'change', sync);
  useEffect(() => sync(progress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Read straight from the DOM: framer's progress value updates a frame late.
  const progressNow = () => {
    const section = sectionRef.current;
    if (!section) return progress.get();
    const top = section.getBoundingClientRect().top + window.scrollY;
    return clamp01((window.scrollY - top) / (section.offsetHeight - window.innerHeight));
  };

  const topFor = (p: number) => {
    const section = sectionRef.current;
    if (!section) return window.scrollY;
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top + p * (section.offsetHeight - window.innerHeight);
  };

  // Stage pose: scroll-derived, with a hand-off for choreographed jumps.
  const holding = useMotionValue(0);
  const heldExplode = useMotionValue(0);
  const heldPops = [useMotionValue(0), useMotionValue(0), useMotionValue(0), useMotionValue(0)];
  const pose: StagePose = {
    explode: useFollow(useTransform(progress, explodeAt), heldExplode, holding),
    pops: [
      useFollow(useTransform(progress, (v) => popAt(0, v)), heldPops[0], holding),
      useFollow(useTransform(progress, (v) => popAt(1, v)), heldPops[1], holding),
      useFollow(useTransform(progress, (v) => popAt(2, v)), heldPops[2], holding),
      useFollow(useTransform(progress, (v) => popAt(3, v)), heldPops[3], holding),
    ],
  };

  const rail = useAnimationControls();
  const busy = useRef(false);

  /**
   * Tab jumps read as one move however far apart the beats are: the page
   * teleports, the stage holds its pose, then the current layer slides home
   * into the fanned-out stack and only the destination comes forward.
   */
  const goTo = async (target: number) => {
    if (busy.current) return;
    const from = progressNow();
    if (Math.abs(from - target) < 0.002) return;
    busy.current = true;

    heldExplode.set(explodeAt(from));
    heldPops.forEach((mv, i) => mv.set(popAt(i, from)));
    holding.set(1);
    window.scrollTo({ top: topFor(target), behavior: 'auto' });

    const out = { duration: 0.42, ease: [0.65, 0, 0.35, 1] as const };
    const back = { duration: 0.55, ease: EASE };
    const anyPopped = heldPops.some((mv) => mv.get() > 0.01);
    await Promise.all([
      rail.start({ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }),
      ...(anyPopped || heldExplode.get() < 0.99
        ? [animate(heldExplode, 1, out), ...heldPops.map((mv) => animate(mv, 0, out))]
        : []),
    ]);
    await Promise.all([
      animate(heldExplode, explodeAt(target), back),
      ...heldPops.map((mv, i) => animate(mv, popAt(i, target), back)),
      rail.start({ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE, delay: 0.12 } }),
    ]);
    holding.set(0);
    busy.current = false;
  };

  const skip = () => {
    const about = document.getElementById('about');
    if (about) window.scrollTo({ top: about.getBoundingClientRect().top + window.scrollY - 64, behavior: 'auto' }); // navbar height
  };

  const reveals = [
    useTransform(progress, (v) => revealAt(1, v)),
    useTransform(progress, (v) => revealAt(2, v)),
    useTransform(progress, (v) => revealAt(3, v)),
  ];

  // The rating lands only once the stack has actually reassembled.
  const ratingIn = useTransform([progress, pose.explode], ([v, e]: number[]) => ramp(v, 0.85, 0.9) * (1 - e));
  const ratingY = useTransform(ratingIn, [0, 1], [36, 0]);
  const ratingRotate = useTransform(ratingIn, [0, 1], [-6, -2]);

  return (
    <section ref={sectionRef} id="hero" className="relative bg-canvas" style={{ height: '560vh' }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Blueprint field behind the stage */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(39,116,174,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(39,116,174,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            WebkitMaskImage: 'radial-gradient(60% 70% at 68% 55%, black, transparent 85%)',
            maskImage: 'radial-gradient(60% 70% at 68% 55%, black, transparent 85%)',
          }}
        />

        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-2 px-4 pb-4 pt-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-8 lg:py-0">
          {/* Text rail */}
          <motion.div animate={rail} className="relative z-10 flex flex-col">
            <div className="grid">
              <FadeBlock
                progress={progress}
                input={[0.03, 0.075]}
                output={[1, 0]}
                interactiveFrom={(v) => v < 0.06}
                onFocusCapture={() => progress.get() > 0.03 && goTo(0)}
              >
                <Identity animated onSkip={skip} />
              </FadeBlock>

              {BEATS.map((beat, i) => {
                const [s, e] = WINDOWS[i];
                return (
                  <FadeBlock key={beat.tab} progress={progress} input={[s + 0.012, s + 0.045, e - 0.04, e - 0.008]} output={[0, 1, 1, 0]}>
                    <Caption beat={beat} />
                  </FadeBlock>
                );
              })}

              <FadeBlock
                progress={progress}
                input={[0.835, 0.885]}
                output={[0, 1]}
                interactiveFrom={(v) => v > 0.86}
                onFocusCapture={() => progress.get() < 0.86 && goTo(OUTCOME_AT)}
              >
                <Outcome />
              </FadeBlock>
            </div>

            {/* The story's table of contents — also its keyboard path. */}
            <nav aria-label="LionCity build story" className="mt-6 lg:mt-12">
              <ol className="flex flex-wrap gap-x-1">
                {TABS.map((tab, i) => {
                  const current = active === i;
                  const done = active > i;
                  return (
                    <li key={tab}>
                      <button
                        type="button"
                        onClick={() => goTo(TAB_TARGETS[i])}
                        aria-current={current ? 'step' : undefined}
                        className={`group relative flex h-11 items-center rounded-md px-2 text-sm font-medium transition-colors duration-200 ${
                          current ? 'text-ink' : 'text-ink-faint hover:text-ink'
                        }`}
                      >
                        {tab}
                        <span
                          className={`absolute inset-x-2 bottom-1.5 h-[2px] rounded-full transition-colors duration-300 ${
                            current ? 'bg-ucla-blue' : done ? 'bg-ucla-blue/35' : 'bg-hairline group-hover:bg-ink-faint'
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </motion.div>

          {/* Stage */}
          <div ref={stageRef} className="relative h-full min-h-0 w-full lg:h-[min(80vh,660px)]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2"
              style={{
                width: STAGE_W,
                height: STAGE_H,
                marginLeft: -STAGE_W / 2,
                marginTop: -STAGE_H / 2,
                transform: `scale(${scale})`,
                perspective: '2400px',
                visibility: scale ? 'visible' : 'hidden',
              }}
            >
              <StackLayer index={3} pose={pose} label={BEATS[3].label}>
                <TelegramLayer reveal={reveals[2]} />
              </StackLayer>
              <StackLayer index={2} pose={pose} label={BEATS[2].label}>
                <DataLayer reveal={reveals[1]} />
              </StackLayer>
              <StackLayer index={1} pose={pose} label={BEATS[1].label}>
                <MatchingLayer reveal={reveals[0]} />
              </StackLayer>
              <StackLayer index={0} pose={pose} label={BEATS[0].label}>
                <StorefrontLayer assemble instant={instant} />
              </StackLayer>

              <motion.div
                className="absolute -bottom-8 left-[178px] z-30"
                style={{ opacity: ratingIn, y: ratingY, rotate: ratingRotate }}
              >
                <RatingCard />
              </motion.div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Reduced motion — the same story as a static stacked diagram         */
/* ------------------------------------------------------------------ */

const FlatArt: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, scale] = useFitScale();
  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      <div
        aria-hidden
        className="absolute left-0 top-0 rounded-[18px] shadow-[0_24px_50px_-24px_rgba(20,47,76,0.4)]"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}
      >
        {children}
      </div>
    </div>
  );
};

const StaticTeardown: React.FC = () => {
  const done = useMotionValue(1);
  const layers = [
    <StorefrontLayer key="s" />,
    <MatchingLayer key="m" reveal={done} />,
    <DataLayer key="d" reveal={done} />,
    <TelegramLayer key="t" reveal={done} />,
  ];
  return (
    <section id="hero" className="bg-canvas pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Identity animated={false} />
      </div>
      <div className="mx-auto mt-20 max-w-7xl space-y-24 px-4 sm:px-6 lg:px-8">
        {BEATS.map((beat, i) => (
          <div key={beat.tab} className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <Caption beat={beat} />
            <FlatArt>{layers[i]}</FlatArt>
          </div>
        ))}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Outcome />
          <div className="flex justify-center">
            <div className="origin-center scale-125">
              <RatingCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Teardown: React.FC = () => {
  const reduce = useReducedMotion();
  return reduce ? <StaticTeardown /> : <PinnedTeardown />;
};

export default Teardown;
