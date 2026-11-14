import cuesJson from "./cues.json";
import { sp } from "../../launch-15s/src/film/motion";

export type Msg = { label: string | null; text: string | null; bars: number[] | null; keys: number[]; typeStart: number; send: number };
type Span = { start: number; end: number };
export type Thread = {
  msgs: Msg[];
  dots: number;
  reply: number;
  text: string;
  working: number;
  done: number;
  tap: number;
  open: Span;
};
export type TypedLine = { t: string; frames: number[]; del?: number[] };

export type Cues = {
  fps: number;
  total: number;
  copy: { kicker: string; passNote: string; question: string; ask: string; thought: string[]; brand: string; brandLine: string; tagline: string; credit: string };
  chats: {
    astra: { name: string; accent: string; logo: string; intro: Thread };
    fable: { name: string; accent: string; logo: string; intro: Thread; rant: Thread };
  };
  astraFilm: Span;
  astraClip: { file: string; frames: number; still: number };
  shrink: Span;
  swap: Span;
  v3: { start: number; cut: number; file: string; play: number; frames: number; trim: number };
  pass: { note: number; stamp: number; fling: number; flingEnd: number };
  v4: Span & { file: string; frames: number; still: number };
  outro: { start: number; question: TypedLine; ask: TypedLine; thought: TypedLine[]; brand: number; end: number };
  notes: { astra: TypedLine[]; v3: TypedLine[]; v4: TypedLine[] };
};

export const cues = cuesJson as Cues;

// Palette from the app's tokens (launch-15s/src/film/theme.ts) plus one accent per model.
export const C = {
  bg: "#07090f",
  surface: "#0b0e14",
  raised: "#141a24",
  bubble: "#1c2330",
  edge: "#232b38",
  text1: "#f5f7ff",
  text2: "#c0c9dc",
  text3: "#8d9ab4",
  pass: "#e5484d",
};

export const FONT = '"Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", "Segoe UI Emoji", sans-serif';

export const SURFACE = { w: 1080, h: 1920 };
// Where a film plays: pushed up, leaving room for the user's comments below.
export const FILM = { x: 135, y: 56, w: 810, h: 1440 };
export const NOTES_Y = 1556;

// Chat geometry. The message list is anchored to the bottom, above the
// composer, so the delivered video card always lands in the same place.
export const CHAT = {
  header: 342,
  side: 36,
  composerBottom: 120,
  composerMin: 132,
  listGap: 40,
  avatar: 64,
  avatarGap: 18,
};
const listBottom = SURFACE.h - CHAT.composerBottom - CHAT.composerMin - CHAT.listGap;
export const CHAT_CARD = { x: CHAT.side + CHAT.avatar + CHAT.avatarGap, y: listBottom - 640, w: 360, h: 640 };
export const cardRise = (f: number, done: number) => sp(f, done, { damping: 16, stiffness: 200 });

// The two slots of the closing choice.
export const SLOT_W = 516;
export const SLOT_H = (SLOT_W * 16) / 9;
export const SLOT_Y = 560;
export const SLOT_X = { astra: 16, fable: 548 };
