/**
 * Emoji scale icons for the Likert rating input (1–5).
 * Each component accepts a `className` prop for sizing.
 *
 * Scale mapping:
 *  1 – Sangat Tidak Setuju  (angry / red face)
 *  2 – Tidak Setuju         (slightly frowning)
 *  3 – Netral               (neutral face)
 *  4 – Setuju               (slightly smiling)
 *  5 – Sangat Setuju        (big smile / star-struck)
 */

export function EmojiAngry({ className = "w-10 h-10" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 36"><path fill="#ffcc4d" d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18" /><path fill="#664500" d="M25.485 29.879C25.44 29.7 24.317 25.5 18 25.5s-7.44 4.2-7.485 4.379a.5.5 0 0 0 .237.554a.51.51 0 0 0 .6-.077c.019-.019 1.954-1.856 6.648-1.856s6.63 1.837 6.648 1.855a.5.5 0 0 0 .598.081a.5.5 0 0 0 .239-.557m-9.778-12.586C12.452 14.038 7.221 14 7 14a1.001 1.001 0 0 0-.001 2c.029 0 1.925.022 3.983.737c-.593.64-.982 1.634-.982 2.763c0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-.174-.019-.34-.037-.507c.013 0 .025.007.037.007a.999.999 0 0 0 .707-1.707M29 14c-.221 0-5.451.038-8.707 3.293A.999.999 0 0 0 21 19c.013 0 .024-.007.036-.007c-.016.167-.036.333-.036.507c0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-1.129-.389-2.123-.982-2.763A14 14 0 0 1 29.002 16A1 1 0 0 0 29 14" /></svg>
  );
}

export function EmojiFrown({ className = "w-10 h-10" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 36"><path fill="#ffcc4d" d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18" /><ellipse cx="11.5" cy="14.5" fill="#664500" rx="2.5" ry="3.5" /><ellipse cx="24.5" cy="14.5" fill="#664500" rx="2.5" ry="3.5" /><path fill="#664500" d="M8.665 27.871a.5.5 0 0 0 .635.029c.039-.029 3.922-2.9 8.7-2.9c4.766 0 8.662 2.871 8.7 2.9a.5.5 0 0 0 .729-.657C27.3 27.029 24.212 22 18 22s-9.301 5.028-9.429 5.243a.5.5 0 0 0 .094.628" /></svg>
  );
}

export function EmojiNeutral({ className = "w-10 h-10" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 36"><path fill="#ffcc4d" d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18" /><ellipse cx="11.5" cy="16.5" fill="#664500" rx="2.5" ry="3.5" /><ellipse cx="24.5" cy="16.5" fill="#664500" rx="2.5" ry="3.5" /><path fill="#664500" d="M25 26H11a1 1 0 1 1 0-2h14a1 1 0 1 1 0 2" /></svg>
  );
}

export function EmojiSmile({ className = "w-10 h-10" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#ffcc4d" /><path fill="#664500" d="M10.515 23.621C10.56 23.8 11.683 28 18 28s7.44-4.2 7.485-4.379a.5.5 0 0 0-.237-.554a.505.505 0 0 0-.6.077C24.629 23.163 22.694 25 18 25s-6.63-1.837-6.648-1.855a.5.5 0 0 0-.598-.081a.5.5 0 0 0-.239.557" /><ellipse cx="12" cy="13.5" fill="#664500" rx="2.5" ry="3.5" /><ellipse cx="24" cy="13.5" fill="#664500" rx="2.5" ry="3.5" /></svg>
  );
}

export function EmojiGrin({ className = "w-10 h-10" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 36"><path fill="#ffcc4d" d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18" /><path fill="#664500" d="M16 18c-.419 0-.809-.265-.949-.684C14.848 16.717 14.034 15 13 15c-1.062 0-1.888 1.827-2.051 2.316a1 1 0 1 1-1.897-.633C9.177 16.307 10.356 13 13 13s3.823 3.307 3.949 3.684A1 1 0 0 1 16 18m10 0a1 1 0 0 1-.948-.684C24.849 16.717 24.033 15 23 15c-1.062 0-1.889 1.827-2.052 2.316a1 1 0 0 1-1.897-.633C19.177 16.307 20.355 13 23 13s3.823 3.307 3.948 3.684A1 1 0 0 1 26 18m-8 4c-3.623 0-6.027-.422-9-1c-.679-.131-2 0-2 2c0 4 4.595 9 11 9c6.404 0 11-5 11-9c0-2-1.321-2.132-2-2c-2.973.578-5.377 1-9 1" /><path fill="#fff" d="M9 23s3 1 9 1s9-1 9-1s-1.344 6.75-9 6.75S9 23 9 23" /><path fill="#664500" d="M18 27.594c-3.596 0-6.272-.372-7.937-.745l-.825-1.871c.823.312 3.889.897 8.763.897c4.954 0 8.037-.616 8.864-.938l-.701 1.842c-1.634.38-4.419.815-8.164.815" /></svg>
  )
}

/** Ordered array of emoji components indexed by scale value (1-based). */
export const SCALE_EMOJIS = [null, EmojiAngry, EmojiFrown, EmojiNeutral, EmojiSmile, EmojiGrin];

/** Label for each scale value. */
export const SCALE_LABELS = ["", "Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];
