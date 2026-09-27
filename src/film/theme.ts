// Values mirror the app's "Obsidian Ceramic" tokens (src/styles/tokens.css in
// Meowcal-Sub) so the film uses the product's own palette, not a new one.
export const C = {
  bg: "#07090f",
  text1: "#f5f7ff",
  text2: "#c0c9dc",
  text3: "#8d9ab4",
  accent: "#e8eef7",
  success: "#55d699",
  line: "rgba(255, 255, 255, 0.09)",
  plateDark: "#0b0b0b",
  plateLight: "#f5f7fa",
  plateLightInk: "#101820",
  logoStroke: "#27303d",
} as const;

export const FONT_DISPLAY = '"Segoe UI Variable Display", "Segoe UI", sans-serif';
export const FONT_TEXT = '"Segoe UI Variable Text", "Segoe UI", sans-serif';

const CJK_FAMILY: Record<string, string> = {
  "ja-JP": '"Yu Gothic UI", "Yu Gothic"',
  "ko-KR": '"Malgun Gothic"',
  "zh-CN": '"Microsoft YaHei UI", "Microsoft YaHei"',
  "zh-TW": '"Microsoft JhengHei UI", "Microsoft JhengHei"',
};

// Latin glyphs come from Segoe; Han/kana/hangul fall through to the font that
// Windows itself uses for that language, so Japanese never renders in a
// Chinese face.
export function fontFor(lang: string, base: string): string {
  const cjk = CJK_FAMILY[lang];
  return cjk ? base.replace(/, sans-serif$/, `, ${cjk}, sans-serif`) : base;
}

// Labels exactly as the app's language picker shows them (src/ui/languages.ts).
export const LANGUAGE_LABEL: Record<string, string> = {
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  "ja-JP": "Japanese",
  "ko-KR": "Korean",
  "en-US": "English (US)",
  "es-ES": "Spanish",
  "fr-FR": "French",
  "de-DE": "German",
};
