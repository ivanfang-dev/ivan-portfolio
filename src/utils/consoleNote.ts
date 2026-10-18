/**
 * A hello for whoever opens the inspector — usually an engineer, sometimes a
 * curious recruiter. Logged once per page load.
 */
export function printConsoleNote(): void {
  const display = "font-family: 'Bricolage Grotesque Variable', system-ui, sans-serif;";
  const blue = '#2774ae';

  console.log(
    '%cHey, you opened the inspector 👋%c.',
    // Ink-colored line with the site's blue terminal period. `inherit` keeps it
    // legible in both light and dark devtools.
    `${display} font-size: 22px; font-weight: 800; color: inherit; padding: 8px 0 2px;`,
    `${display} font-size: 22px; font-weight: 800; color: ${blue};`,
  );
  console.log(
    "%cI'm Ivan. Thanks for looking under the hood.\n" +
      'This one is React + TypeScript, Tailwind v4 and Framer Motion, deployed with GitHub Actions.',
    'font-size: 13px; line-height: 1.6; color: inherit;',
  );
  console.log(
    '%cSource%c   https://github.com/ivanfang-dev/ivan-portfolio\n' +
      '%cBuilt%c    https://www.lioncitytutors.com/\n' +
      '%cSay hi%c   ivanfang@ucla.edu 💙💛',
    `font-weight: 700; color: ${blue};`, 'color: inherit;',
    `font-weight: 700; color: ${blue};`, 'color: inherit;',
    `font-weight: 700; color: ${blue};`, 'color: inherit;',
  );
}
