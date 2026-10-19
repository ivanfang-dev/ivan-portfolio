import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

/*
 * LionCity Tutors, rebuilt as four stackable layers of DOM for the hero
 * teardown. Every layer is authored at a fixed 640×420 design size; the stage
 * scales the whole stack to fit. The art follows LionCity's own UI (Inter-ish
 * system sans, #0474ba blue, #eb711d orange) so the product looks like itself.
 *
 * Layers that animate internally take `reveal`: 0→1 progress through their own
 * beat. The static (reduced-motion) diagram passes a constant 1.
 */

export const STAGE_W = 640;
export const STAGE_H = 420;

const LC = {
  blue: '#0474ba',
  orange: '#eb711d',
  ink: '#171717',
  body: '#525252',
  faint: '#a3a3a3',
  line: '#e5e5e5',
  wash: '#f6f7f8',
  green: '#25d366',
};

const LOGO = `${import.meta.env.BASE_URL}lc-logo.webp`;

const sans = { fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const mono = { fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" };

const Panel: React.FC<{ className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  className = '',
  style,
  children,
}) => (
  <div
    className={`absolute inset-0 overflow-hidden rounded-[18px] ${className}`}
    style={{ ...sans, ...style }}
  >
    {children}
  </div>
);

const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Fades and lifts a fragment in once `reveal` passes `at`. */
const Reveal: React.FC<{ reveal: MotionValue<number>; at: number; className?: string; children: React.ReactNode }> = ({
  reveal,
  at,
  className = '',
  children,
}) => {
  const opacity = useTransform(reveal, (v) => ramp(v, at, at + 0.08));
  const y = useTransform(reveal, (v) => (1 - ramp(v, at, at + 0.08)) * 10);
  return (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · Storefront — the live site, in a browser frame                 */
/* ------------------------------------------------------------------ */

export interface StorefrontProps {
  /** Assembly entrance on first load: fragments fly in and snap together. */
  assemble?: boolean;
  /** Skip the entrance (visitor scrolled early, or reduced motion). */
  instant?: boolean;
}

// Where each fragment flies in from during assembly.
const SCATTER: Record<string, { x: number; y: number; rotate: number }> = {
  chrome: { x: 0, y: -40, rotate: 0 },
  nav: { x: -30, y: -60, rotate: -3 },
  kicker: { x: -120, y: -30, rotate: -6 },
  line1: { x: -160, y: 20, rotate: -4 },
  line2: { x: -140, y: 60, rotate: 3 },
  sub: { x: -90, y: 90, rotate: 2 },
  cta: { x: -40, y: 140, rotate: -8 },
  wa: { x: 60, y: 150, rotate: 7 },
  chips: { x: -20, y: 170, rotate: 2 },
  map: { x: 160, y: -20, rotate: 4 },
  replay: { x: 140, y: 110, rotate: -5 },
  towns: { x: 90, y: 150, rotate: 3 },
  bubble: { x: 120, y: 120, rotate: 20 },
};
const ORDER = Object.keys(SCATTER);

const Frag: React.FC<{
  id: keyof typeof SCATTER;
  assemble: boolean;
  instant: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ id, assemble, instant, className = '', style, children }) => {
  const home = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
  return (
    <motion.div
      className={className}
      style={style}
      // Switching variant (not just transition) is what lets a scroll snap an
      // entrance that's still mid-flight.
      variants={{
        scattered: { opacity: 0, scale: 0.92, ...SCATTER[id] },
        assembled: {
          ...home,
          transition: { type: 'spring', stiffness: 170, damping: 19, mass: 0.9, delay: 0.35 + ORDER.indexOf(id) * 0.065 },
        },
        snapped: { ...home, transition: { duration: 0 } },
      }}
      initial={assemble ? 'scattered' : false}
      animate={instant ? 'snapped' : 'assembled'}
    >
      {children}
    </motion.div>
  );
};

/*
 * The live hero's tutor map: LionCity's own dot-grid Singapore (public/lc-tutor-map.svg,
 * copied from apps/website/public/sg-tutor-map.svg), replaying one real request. All
 * coordinates are that map's grid units, viewBox -1 -1 106 51.
 */

const MAP_W = 318;
const MAP_H = (MAP_W * 51) / 106;
const MAP_SRC = `${import.meta.env.BASE_URL}lc-tutor-map.svg`;

// The first replay in apps/website/src/data/matchReplays.js. Minutes from the request.
const REPLAY = { title: 'Primary 1 English', town: 'Punggol', month: 'Jun 2026', contacted: 14, messaged: 1, yes: [26, 34, 38], sent: 45 };
const clock = (mins: number) => `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

// Punggol's pin, and the 14 north-east tutors it messaged. The yeses carry their minute
// and which side of the dot their label sits on, so the three never collide.
const PIN: [number, number] = [65.2, 14];
const ASKED: { at: [number, number]; yes?: number; side?: 'left' | 'right' | 'below' }[] = [
  { at: [64, 13] }, { at: [65, 12] }, { at: [66, 13] }, { at: [67, 13] },
  { at: [69, 13], yes: 34, side: 'right' }, { at: [69, 15] }, { at: [67, 15] }, { at: [64, 15] },
  { at: [62, 14] }, { at: [60, 15], yes: 26, side: 'left' }, { at: [58, 17] }, { at: [61, 17] },
  { at: [64, 19], yes: 38, side: 'below' }, { at: [66, 19] },
];

/** A message's flight from the pin: lifted off the straight line, alternately each side. */
const arcTo = ([bx, by]: [number, number], i: number) => {
  const [ax, ay] = PIN;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const lift = Math.min(5, len * 0.4) * (i % 2 ? 1 : -1);
  return `M ${ax} ${ay} Q ${ax + dx / 2 - (dy / len) * lift} ${ay + dy / 2 + (dx / len) * lift} ${bx} ${by}`;
};

const pct = ([x, y]: [number, number]) => ({ left: `${((x + 1) / 106) * 100}%`, top: `${((y + 1) / 51) * 100}%` });

// The live hero's camera on this request: pushed in 1.5×, centred on the pin, clamped to the map.
const ZOOM = 1.5;
const CAMERA = {
  x: `${Math.min(0, Math.max(1 - ZOOM, 0.5 - ((PIN[0] + 1) / 106) * ZOOM)) * 100}%`,
  y: `${Math.min(0, Math.max(1 - ZOOM, 0.45 - ((PIN[1] + 1) / 51) * ZOOM)) * 100}%`,
};

type Pose = Record<string, number | string>;

/** Plays once after the map lands; a scroll snaps it to its end like the fragments. */
const beat = (assemble: boolean, instant: boolean, delay: number, from: Pose, to: Pose, duration = 0.5) => ({
  variants: {
    off: from,
    on: { ...to, transition: { duration, ease: [0.22, 1, 0.36, 1] as const, delay } },
    snapped: { ...to, transition: { duration: 0 } },
  },
  initial: assemble ? 'off' : false,
  animate: instant ? 'snapped' : 'on',
});

const TutorMap: React.FC<{ assemble: boolean; instant: boolean }> = ({ assemble, instant }) => {
  const at = (delay: number, from: Pose, to: Pose, duration?: number) => beat(assemble, instant, delay, from, to, duration);
  const yeses = ASKED.filter((t) => t.yes !== undefined).sort((a, b) => a.yes! - b.yes!);
  const yesDelay = (t: (typeof ASKED)[number]) => 3 + yeses.indexOf(t) * 0.3;
  const centred = { transformBox: 'fill-box', transformOrigin: 'center' } as const;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: 'radial-gradient(ellipse 72% 70% at 50% 50%, #000 62%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 72% 70% at 50% 50%, #000 62%, transparent 100%)',
      }}
    >
      {/* The whole island first, then the camera flies in on the request. Everything inside is
          scaled with it, so the overlay below is drawn at 1/ZOOM of its on-screen size. */}
      <motion.div className="absolute inset-0 origin-top-left" {...at(1.25, { x: '0%', y: '0%', scale: 1 }, { ...CAMERA, scale: ZOOM }, 1.1)}>
        <img src={MAP_SRC} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
        <svg className="absolute inset-0 h-full w-full" viewBox="-1 -1 106 51" fill="none" strokeLinecap="round" aria-hidden>
          {ASKED.map((t, i) => (
            <motion.path
              key={i}
              d={arcTo(t.at, i)}
              stroke={LC.orange}
              strokeOpacity={t.yes ? 0.6 : 0.35}
              strokeWidth={0.3}
              {...at(2.15 + i * 0.05, { pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1 })}
            />
          ))}
          {ASKED.map((t, i) =>
            t.yes ? (
              <motion.circle key={i} cx={t.at[0]} cy={t.at[1]} r={0.9} fill={LC.blue} stroke="#fff" strokeWidth={0.4} {...at(yesDelay(t), { scale: 0 }, { scale: 1 })} style={centred} />
            ) : (
              <motion.circle key={i} cx={t.at[0]} cy={t.at[1]} r={0.65} stroke={LC.orange} strokeOpacity={0.6} strokeWidth={0.25} {...at(2.6 + i * 0.05, { opacity: 0 }, { opacity: 1 })} />
            ),
          )}
          <motion.circle cx={PIN[0]} cy={PIN[1]} r={2.8} stroke={LC.orange} strokeOpacity={0.35} strokeWidth={0.3} {...at(2.05, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 })} style={centred} />
          <motion.circle cx={PIN[0]} cy={PIN[1]} r={1.3} fill={LC.orange} stroke="#fff" strokeWidth={0.6} {...at(2, { scale: 0 }, { scale: 1 })} style={centred} />
        </svg>
        {yeses.map((t) => (
          <span
            key={t.yes}
            className="absolute"
            style={{
              ...pct(t.at),
              transform: t.side === 'left' ? 'translate(calc(-100% - 3px), -50%)' : t.side === 'right' ? 'translate(3px, -50%)' : 'translate(-50%, 3px)',
            }}
          >
            <motion.span
              className="block whitespace-nowrap rounded-full bg-white px-[3.5px] py-[1.5px] text-[4.8px] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
              style={{ color: LC.blue }}
              {...at(yesDelay(t) + 0.1, { opacity: 0 }, { opacity: 1 })}
            >
              Yes · {clock(t.yes!)}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const StorefrontLayer: React.FC<StorefrontProps> = ({ assemble = false, instant = true }) => {
  const f = { assemble, instant };
  return (
    <Panel className="bg-white" style={{ boxShadow: `inset 0 0 0 1px ${LC.line}` }}>
      {/* Browser chrome */}
      <Frag id="chrome" {...f} className="absolute inset-x-0 top-0 flex h-[30px] items-center gap-[6px] border-b px-3" style={{ borderColor: LC.line, background: LC.wash }}>
        <span className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
        <span className="mx-auto flex h-[18px] w-[230px] items-center justify-center gap-1.5 rounded-md bg-white text-[10px]" style={{ color: LC.body }}>
          <svg width="8" height="9" viewBox="0 0 8 9" aria-hidden><rect x="0.5" y="3.5" width="7" height="5" rx="1" fill={LC.faint} /><path d="M2 3.5V2.5a2 2 0 014 0v1" stroke={LC.faint} fill="none" /></svg>
          lioncitytutors.com
        </span>
      </Frag>

      {/* Site nav */}
      <Frag id="nav" {...f} className="absolute inset-x-0 top-[30px] flex h-[40px] items-center px-5">
        <span className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: LC.blue }}>
          <img src={LOGO} alt="" width={18} height={18} draggable={false} />
          LionCity Tutors
        </span>
        <span className="ml-6 flex gap-3.5 text-[9px] font-medium" style={{ color: LC.body }}>
          <span className="rounded-md px-1.5 py-0.5" style={{ color: LC.blue, background: '#f5f5f5' }}>Home</span>
          <span className="py-0.5">Levels &amp; Exams</span>
          <span className="py-0.5">Subjects</span>
          <span className="py-0.5">For Parents</span>
          <span className="py-0.5">For Tutors</span>
        </span>
        <span className="ml-auto rounded-full px-3 py-[5px] text-[9px] font-semibold text-white" style={{ background: LC.orange }}>
          Get Free Tutor Matching
        </span>
      </Frag>

      {/* Hero copy */}
      <div className="absolute left-[26px] top-[104px] w-[318px]">
        <Frag id="kicker" {...f} className="text-[8.5px] font-semibold tracking-[0.16em]" style={{ color: LC.blue }}>
          PSLE · O/N-LEVEL · JC
        </Frag>
        <div className="mt-2 text-[35px] font-bold leading-[1.02] tracking-[-0.025em]" style={{ color: LC.ink }}>
          <Frag id="line1" {...f}>
            The <span style={{ color: LC.blue }}>Right</span> Tutor.
          </Frag>
          <Frag id="line2" {...f} className="relative w-fit">
            Matched in <span className="relative">hours
              <svg className="absolute -bottom-[7px] left-0 w-full" height="9" viewBox="0 0 100 9" preserveAspectRatio="none" aria-hidden>
                <path d="M2 6 C 20 1, 38 9, 56 4 S 88 2, 98 5" stroke={LC.orange} strokeWidth="3.2" fill="none" strokeLinecap="round" />
              </svg>
            </span>.
          </Frag>
        </div>
        <Frag id="sub" {...f} className="mt-3.5 text-[11px] leading-[1.55]" style={{ color: LC.body }}>
          Vetted, MOE-familiar tutors matched by hand — <b style={{ color: LC.ink }}>within 6 hours</b>. And parents never pay an agency fee.
        </Frag>
        <div className="mt-4 flex items-center gap-2">
          <Frag id="cta" {...f} className="rounded-full px-4 py-[9px] text-[11px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(235,113,29,0.7)]" style={{ background: LC.orange }}>
            Request tutors
          </Frag>
          <Frag id="wa" {...f} className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-[7px] text-[9.5px] font-medium" style={{ borderColor: LC.line, color: LC.body }}>
            <span className="h-[8px] w-[8px] rounded-full" style={{ background: LC.green }} />
            Or message us on WhatsApp →
          </Frag>
        </div>
        <Frag id="chips" {...f} className="mt-4 flex w-fit items-center gap-2 rounded-full border bg-white px-2.5 py-[5px] text-[8.5px] shadow-[0_2px_6px_-3px_rgba(0,0,0,0.15)]" style={{ borderColor: LC.line, color: LC.body }}>
          <span><span style={{ color: '#f59e0b' }}>★</span> 4.8/5 on Google</span>
          <span className="h-2.5 w-px" style={{ background: LC.line }} />
          <span>100+ families matched</span>
          <span className="h-2.5 w-px" style={{ background: LC.line }} />
          <span>400+ vetted tutors</span>
        </Frag>
      </div>

      {/* Tutor map, bleeding off the right edge like the live hero */}
      <Frag id="map" {...f} className="absolute left-[334px] top-[96px]" style={{ width: MAP_W, height: MAP_H }}>
        <TutorMap {...f} />
        <span className="absolute left-[6px] top-[4px] flex items-center gap-1 rounded-full border bg-white px-2 py-[3px] text-[7.5px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ borderColor: LC.line, color: LC.body }}>
          <svg width="7" height="8" viewBox="0 0 24 24" fill="none" stroke={LC.orange} strokeWidth="2.5" aria-hidden><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          Find your neighbourhood
        </span>
      </Frag>

      {/* The replay card: one real request, pin to shortlist */}
      <Frag id="replay" {...f} className="absolute right-[18px] top-[214px] w-[226px] rounded-[12px] border bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)]" style={{ borderColor: LC.line }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[7.5px]" style={{ color: LC.faint }}>Real request · {REPLAY.town} · {REPLAY.month}</div>
            <div className="mt-0.5 text-[10.5px] font-semibold" style={{ color: LC.ink }}>{REPLAY.title}</div>
          </div>
          <div className="text-right leading-none">
            <div className="text-[21px] font-bold tabular-nums tracking-[-0.02em]" style={{ color: LC.blue }}>{clock(REPLAY.sent)}</div>
            <div className="mt-0.5 text-[7px]" style={{ color: LC.faint }}>hrs since request</div>
          </div>
        </div>
        <ol className="mt-2.5 space-y-[5px] border-t pt-2.5 text-[8.5px]" style={{ borderColor: '#f5f5f5' }}>
          {[
            [`${REPLAY.contacted} tutors messaged`, REPLAY.messaged],
            ['First tutor says yes', REPLAY.yes[0]],
            [`${REPLAY.yes.length} profiles sent to the parent`, REPLAY.sent],
          ].map(([label, at], i, rows) => {
            const last = i === rows.length - 1;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: last ? LC.orange : LC.blue, boxShadow: last ? '0 0 0 2px rgba(235,113,29,0.2)' : undefined }}
                />
                <span className={`flex-1 ${last ? 'font-semibold' : ''}`} style={{ color: last ? LC.ink : '#404040' }}>{label}</span>
                <span className="tabular-nums" style={{ color: LC.body }}>{clock(at as number)}</span>
              </li>
            );
          })}
        </ol>
      </Frag>

      {/* Replay picker */}
      <Frag id="towns" {...f} className="absolute right-[58px] top-[352px] flex items-center gap-0.5 text-[8.5px]" style={{ color: LC.faint }}>
        {['Punggol', 'Jurong West', 'Bedok', 'Hougang'].map((town, i) => (
          <span
            key={town}
            className={`relative rounded-full px-2 py-[3px] ${i === 0 ? 'font-medium' : ''}`}
            style={i === 0 ? { background: 'rgba(4,116,186,0.1)', color: '#035e96' } : undefined}
          >
            {town}
            {i === 0 && <span className="absolute inset-x-2 bottom-[1px] h-px rounded-full" style={{ background: LC.blue, opacity: 0.45 }} />}
          </span>
        ))}
        <svg className="ml-1" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={LC.faint} strokeWidth="2.5" aria-hidden><path d="M8 5v14M16 5v14" /></svg>
      </Frag>

      {/* Floating WhatsApp button */}
      <Frag id="bubble" {...f} className="absolute bottom-[16px] right-[14px] grid h-[34px] w-[34px] place-items-center rounded-full shadow-[0_8px_16px_-6px_rgba(37,211,102,0.8)]" style={{ background: LC.green }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden>
          <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.4-.3z" />
        </svg>
      </Frag>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Matching — a request, the shortlist, and the clock             */
/* ------------------------------------------------------------------ */

// The four stamps on LionCity's own "What happens after you hit send" timeline.
const CLOCK = [
  { t: '0:00', label: 'Request sent' },
  { t: '0:01', label: 'Tutors messaged' },
  { t: '0:17', label: 'First tutor says yes' },
  { t: '< 6h', label: 'Shortlist on WhatsApp' },
];

const TUTORS = [
  { initials: 'JL', line: 'Ex-MOE teacher · 8 yrs', tint: LC.blue },
  { initials: 'SA', line: 'NUS Maths grad · 4 yrs', tint: LC.orange },
  { initials: 'KR', line: 'Full-time tutor · 6 yrs', tint: '#0f766e' },
];

export const MatchingLayer: React.FC<{ reveal: MotionValue<number> }> = ({ reveal }) => {
  const fill = useTransform(reveal, (v) => ramp(v, 0.12, 0.8));
  return (
    <Panel className="bg-[#fbfbfa]" style={{ boxShadow: `inset 0 0 0 1px ${LC.line}` }}>
      {/* Request card */}
      <div className="absolute left-[24px] top-[24px] w-[260px] rounded-[14px] border bg-white p-4 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.25)]" style={{ borderColor: LC.line }}>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold" style={{ color: LC.ink }}>New tutor request</span>
          <span className="rounded-full px-2 py-0.5 text-[8.5px] font-semibold text-white" style={{ background: LC.orange }}>Just in</span>
        </div>
        <dl className="mt-3 grid grid-cols-[64px_1fr] gap-y-[7px] text-[10.5px]">
          {[
            ['Level', 'Primary 2'],
            ['Subject', 'Maths'],
            ['Area', 'Novena'],
            ['Lessons', 'Once a week'],
          ].map(([k, v]) => (
            <React.Fragment key={k}>
              <dt style={{ color: LC.faint }}>{k}</dt>
              <dd className="font-medium" style={{ color: LC.ink }}>{v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>

      {/* Shortlist */}
      <div className="absolute right-[24px] top-[24px] w-[300px]">
        <div className="mb-2.5 text-[11px] font-semibold" style={{ color: LC.body }}>Shortlist · sent to parent</div>
        <div className="space-y-2">
          {TUTORS.map((tutor, i) => (
            <Reveal key={tutor.initials} reveal={reveal} at={0.42 + i * 0.07}>
              <div className="flex items-center gap-3 rounded-[12px] border bg-white px-3 py-2.5" style={{ borderColor: LC.line }}>
                <span className="grid h-[28px] w-[28px] place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: tutor.tint }}>
                  {tutor.initials}
                </span>
                <span className="text-[10.5px] font-medium" style={{ color: LC.ink }}>{tutor.line}</span>
                <span className="ml-auto text-[9px] font-semibold" style={{ color: LC.blue }}>Profile →</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* The clock */}
      <div className="absolute inset-x-[24px] bottom-[26px] rounded-[14px] border bg-white px-5 pb-4 pt-5" style={{ borderColor: LC.line }}>
        <div className="relative mx-[6px] h-[2px] rounded-full" style={{ background: '#f2e2d6' }}>
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full" style={{ background: LC.orange, scaleX: fill }} />
          {CLOCK.map((_, i) => (
            <ClockDot key={i} fill={fill} index={i} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {CLOCK.map((c) => (
            <div key={c.t}>
              <div className="text-[19px] font-bold tabular-nums tracking-[-0.02em]" style={{ color: LC.blue }}>{c.t}</div>
              <div className="mt-0.5 text-[9.5px] leading-snug" style={{ color: LC.body }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

const ClockDot: React.FC<{ fill: MotionValue<number>; index: number }> = ({ fill, index }) => {
  const at = index / (CLOCK.length - 1);
  const scale = useTransform(fill, (v) => (v >= at - 0.001 ? 1 : 0.55));
  const background = useTransform(fill, (v) => (v >= at - 0.001 ? LC.orange : '#f2e2d6'));
  return (
    <motion.span
      className="absolute top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px] ring-white"
      style={{ left: `${at * 100}%`, scale, background }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Data — LionCity's real Express routes and MongoDB collections  */
/* ------------------------------------------------------------------ */

// From apps/backend/server.js and packages/shared/models in the LionCity repo.
const ROUTES = [
  { m: 'POST', path: '/api/requestfortutor', to: 0 },
  { m: 'POST', path: '/api/registerfortutor', to: 1 },
  { m: 'GET', path: '/api/assignments', to: 2 },
  { m: 'POST', path: '/api/assignments/apply', to: 2 },
];
const METHOD_TINT: Record<string, string> = { GET: '#4ade80', POST: '#60a5fa' };

const COLLECTIONS = [
  { name: 'contacts', fields: ['name', 'level', 'levelSubjects[]', 'budget'] },
  { name: 'tutors', fields: ['fullName', 'telegramId', 'teachingLevels', 'locations'] },
  { name: 'assignments', fields: ['level', 'subject', 'rate', 'status'] },
  { name: 'placements', fields: ['assignmentId', 'tutorId', 'agreedRate', 'checkIns[]'] },
];

const CONSUMERS = ['apps/backend', 'apps/website', 'apps/telegram-bot'];

// Row geometry, shared by the boxes and the wires between them.
const TOP = 46;
const ROUTE_H = 50;
const ROUTE_STEP = 62;
const COLL_H = 70;
const COLL_STEP = 76;
const ROUTES_RIGHT = 26 + 268;
const COLLS_LEFT = STAGE_W - 26 - 236;

export const DataLayer: React.FC<{ reveal: MotionValue<number> }> = ({ reveal }) => {
  const draw = useTransform(reveal, (v) => ramp(v, 0.15, 0.7));
  return (
    <Panel className="bg-[#0d1b2a]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
      <div className="absolute left-[26px] top-[20px] text-[11px] font-semibold text-[#8fb3d9]">
        Express <span className="font-normal text-[#5d7a99]">· apps/backend</span>
      </div>
      <div className="absolute top-[20px] w-[236px] text-[11px] font-semibold text-[#7fd1a8]" style={{ left: COLLS_LEFT }}>
        MongoDB <span className="font-normal text-[#4f8a6f]">· @lioncity/shared</span>
      </div>

      {/* Routes */}
      <div className="absolute left-[26px] w-[268px]" style={{ ...mono, top: TOP }}>
        {ROUTES.map((r, i) => (
          <div
            key={r.m + r.path}
            className="absolute inset-x-0 flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.035] px-3 text-[10.5px]"
            style={{ top: i * ROUTE_STEP, height: ROUTE_H }}
          >
            <span className="w-[36px] text-[9.5px] font-bold" style={{ color: METHOD_TINT[r.m] }}>{r.m}</span>
            <span className="text-[#dbe6f2]">{r.path}</span>
          </div>
        ))}
      </div>

      {/* Wires */}
      <svg className="absolute inset-0" width={STAGE_W} height={STAGE_H} aria-hidden>
        {ROUTES.map((r, i) => {
          const y1 = TOP + i * ROUTE_STEP + ROUTE_H / 2;
          const y2 = TOP + r.to * COLL_STEP + COLL_H / 2;
          const x1 = ROUTES_RIGHT + 2;
          const x2 = COLLS_LEFT - 2;
          return (
            <motion.path
              key={i}
              d={`M ${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 40} ${y2}, ${x2} ${y2}`}
              stroke="#4f6f93"
              strokeWidth="1.4"
              fill="none"
              style={{ pathLength: draw }}
            />
          );
        })}
      </svg>

      {/* Collections */}
      <div className="absolute w-[236px]" style={{ ...mono, top: TOP, left: COLLS_LEFT }}>
        {COLLECTIONS.map((c, j) => (
          <div
            key={c.name}
            className="absolute inset-x-0 rounded-[10px] border border-[#2c5a47] bg-[#11261f] px-3 py-2"
            style={{ top: j * COLL_STEP, height: COLL_H }}
          >
            <div className="text-[10.5px] font-bold text-[#7fd1a8]">{c.name}</div>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-[#a8c4b7]">
              {c.fields.map((field) => (
                <span key={field}>{field}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* One models package, three apps reading it */}
      <div className="absolute inset-x-[26px] bottom-[14px] flex h-[40px] items-center gap-2 rounded-[10px] border border-dashed border-white/[0.14] px-3 text-[9.5px] text-[#8fb3d9]">
        <span style={mono} className="font-bold text-[#7fd1a8]">@lioncity/shared</span>
        <span className="text-[#5d7a99]">read by</span>
        {CONSUMERS.map((app) => (
          <span key={app} style={mono} className="rounded-md bg-white/[0.06] px-2 py-1 text-[#dbe6f2]">
            {app}
          </span>
        ))}
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Telegram — the assignments channel and the profile bot         */
/* ------------------------------------------------------------------ */

const TG = {
  head: '#ffffff',
  wall: 'linear-gradient(160deg, #c3d9a4 0%, #a6c792 55%, #93ba8c 100%)',
  out: '#effdde',
  outMeta: '#5fa857',
  key: 'rgba(56, 84, 48, 0.32)',
  meta: '#8a9aa9',
};

// The flow follows apps/telegram-bot: utils/channelFormat.js for the channel post, then
// bot/handlers.js (sendRateInputPrompt, confirm, "Application Submitted Successfully!").
// One assignment throughout, the P2 Maths job from Ivan's own walkthrough.
const JOB = { title: 'P2 Maths', level: 'Primary 2', subject: 'Mathematics', location: 'Novena', frequency: 'Once a week', rate: '$40-60/hr' };

const Bubble: React.FC<{ className?: string; time: string; children: React.ReactNode }> = ({ className = '', time, children }) => (
  <div className={`relative rounded-[11px] rounded-bl-[4px] bg-white px-2.5 pb-1.5 pt-2 shadow-[0_1px_1px_rgba(0,0,0,0.1)] ${className}`}>
    {children}
    <div className="-mt-0.5 text-right text-[7px]" style={{ color: TG.meta }}>{time}</div>
  </div>
);

/** Telegram's inline keyboard: translucent keys hung under the message. */
const Keys: React.FC<{ keys: string[] }> = ({ keys }) => (
  <div className="mt-[3px] space-y-[3px]">
    {keys.map((key) => (
      <div key={key} className="rounded-[7px] py-[5px] text-center text-[8.5px] font-medium text-white" style={{ background: TG.key }}>
        {key}
      </div>
    ))}
  </div>
);

export const TelegramLayer: React.FC<{ reveal: MotionValue<number> }> = ({ reveal }) => (
  <Panel className="flex" style={{ background: TG.wall, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}>
    {/* Channel: every new assignment, posted by the bot */}
    <div className="relative h-full w-[262px] border-r border-black/[0.08]">
      <ChatHeader title="LionCity Tutors" sub="channel" />
      <div className="px-3 pt-3 text-[9.5px] leading-[1.5]" style={{ color: LC.ink }}>
        <Reveal reveal={reveal} at={0.04}>
          <Bubble time="10:47 AM">
            <div>🎯 <b>Title:</b> {JOB.title}</div>
            <div className="mt-1.5">📚 <b>Level:</b> {JOB.level}</div>
            <div>📖 <b>Subject:</b> {JOB.subject}</div>
            <div>📍 <b>Location:</b> {JOB.location}</div>
            <div>📅 <b>Frequency:</b> {JOB.frequency}</div>
            <div>💰 <b>Rate:</b> {JOB.rate}</div>
            <div>👨‍🏫 <b>Tutor Type:</b> Any</div>
            <div className="mt-1.5">💼 <b>Status:</b> Open</div>
            <div className="mt-1.5 font-bold">👇 Click below to apply for this assignment!</div>
          </Bubble>
        </Reveal>
        <Reveal reveal={reveal} at={0.1}>
          <Keys keys={['📝 Apply for this Assignment']} />
        </Reveal>
      </div>
    </div>

    {/* Bot: rate, confirm, submitted */}
    <div className="relative h-full flex-1">
      <ChatHeader title="LionCity Bot" sub="bot" />
      <div className="space-y-[7px] px-3 pt-3 text-[9.5px] leading-[1.45]" style={{ color: LC.ink }}>
        <Reveal reveal={reveal} at={0.2} className="w-[262px]">
          <Bubble time="10:49 AM">
            <div className="font-bold">💰 Please enter your tuition rate for this assignment</div>
            <div className="mt-1" style={{ color: LC.body }}>📝 <b style={{ color: LC.ink }}>Format Examples:</b> 30 · $30 · 30/hr · $30/hr</div>
          </Bubble>
        </Reveal>
        <Reveal reveal={reveal} at={0.3} className="flex justify-end">
          <span className="rounded-[11px] rounded-br-[4px] px-2.5 py-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)]" style={{ background: TG.out }}>
            $40/hr <span className="ml-1 text-[7px]" style={{ color: TG.outMeta }}>10:50 AM ✓✓</span>
          </span>
        </Reveal>
        <Reveal reveal={reveal} at={0.4} className="w-[262px]">
          <Bubble time="10:50 AM">
            Please review your profile, the assignment details, and your rate above. Would you like to update your profile or proceed with the application?
          </Bubble>
          <Keys keys={['📝 Update Profile', '✅ Confirm Application']} />
        </Reveal>
        <Reveal reveal={reveal} at={0.55} className="w-[262px]">
          <Bubble time="10:50 AM">
            <div className="font-bold">✅ Application Submitted Successfully!</div>
            <div className="mt-1 font-bold">🎯 {JOB.title} <span className="font-normal" style={{ color: LC.body }}>· {JOB.location} · {JOB.rate}</span></div>
            <div className="mt-1">📝 <b>Application Status:</b> Pending</div>
          </Bubble>
        </Reveal>
      </div>
      <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[8.5px] font-semibold tracking-[0.04em] text-white">
        Simulation of the real bot
      </span>
    </div>
  </Panel>
);

const ChatHeader: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <div className="flex h-[52px] items-center gap-2.5 border-b border-black/[0.06] px-4" style={{ background: TG.head }}>
    <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#fff1e6]">
      <img src={LOGO} alt="" width={20} height={20} draggable={false} />
    </span>
    <span>
      <span className="block text-[11.5px] font-semibold" style={{ color: LC.ink }}>{title}</span>
      <span className="block text-[9px]" style={{ color: TG.meta }}>{sub}</span>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Outcome — the Google rating card that lands on the reassembled site */
/* ------------------------------------------------------------------ */

export const RatingCard: React.FC = () => (
  <div className="w-[176px] rounded-[14px] border bg-white px-4 py-3.5 shadow-[0_20px_40px_-18px_rgba(20,47,76,0.45)]" style={{ ...sans, borderColor: LC.line }}>
    <div className="flex items-baseline gap-2">
      <span className="text-[30px] font-bold leading-none tracking-[-0.03em]" style={{ color: LC.ink }}>4.8</span>
      <span className="text-[13px] tracking-[0.05em]" style={{ color: '#f59e0b' }}>★★★★★</span>
    </div>
    <div className="mt-1.5 text-[10.5px]" style={{ color: LC.body }}>29 Google reviews</div>
  </div>
);
