let context: CanvasRenderingContext2D | null = null;

export function measure(text: string, font: string): number {
  context ??= document.createElement("canvas").getContext("2d");
  if (!context) throw new Error("2D canvas unavailable for text measurement");
  context.font = font;
  return context.measureText(text).width;
}

// The units OCR boxes and word animations work in: words for spaced scripts,
// single characters for Chinese and Japanese.
export function units(text: string, lang: string): string[] {
  if (lang === "ja-JP" || lang.startsWith("zh")) return Array.from(text);
  return text.split(/(?<= )/);
}

export interface Unit {
  text: string;
  x: number;
  w: number;
  blank: boolean;
}

// Unit offsets relative to the start of the line, measured with the exact
// font the line renders in so OCR boxes sit on the real glyphs.
export function layoutUnits(text: string, lang: string, font: string): { units: Unit[]; width: number } {
  const parts = units(text, lang);
  const result: Unit[] = [];
  let prefix = "";
  for (const part of parts) {
    const x = measure(prefix, font);
    const trimmed = part.trimEnd();
    result.push({ text: part, x, w: measure(trimmed, font), blank: trimmed === "" || /^[、。，,.!?！？]$/.test(trimmed) });
    prefix += part;
  }
  return { units: result, width: measure(text, font) };
}

export function fitSize(text: string, fontOf: (size: number) => string, size: number, maxWidth: number): number {
  const width = measure(text, fontOf(size));
  return width > maxWidth ? size * (maxWidth / width) : size;
}
