export type EmojiItem = {
  emoji: string;
  name: string;
};

export type Segment = {
  type: "type" | "pause" | "select";
  text: string;
  replaceLength: number;
  insertText: string;
  startFrame: number;
  durationInFrames: number;
  dropdownItems: EmojiItem[];
};

export type EditorState = {
  text: string;
  dropdownItems: EmojiItem[] | null;
  lastTypingEndFrame: number;
};

/**
 * Compute per-character weights for non-linear typing.
 * Higher weight = more time spent on that character.
 */
function getCharWeights(text: string): number[] {
  const weights: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : "";

    let weight = 1.0;

    if (ch === "\n") {
      weight = 0.5;
    } else if (".!?;".includes(prev)) {
      // Longer pause after sentence-ending punctuation
      weight = 3.0;
    } else if (prev === " ") {
      // Slight hesitation at word boundaries
      weight = 1.4;
    } else if (prev === "\n") {
      weight = 2.0;
    }

    // Deterministic jitter based on position and char code
    const hash = ((i * 7 + text.charCodeAt(i) * 13) % 100) / 100;
    weight *= 0.7 + hash * 0.6; // range: 0.7x to 1.3x

    weights.push(weight);
  }

  return weights;
}

/**
 * Map elapsed frames to character count using weighted timing.
 * Total duration stays the same, but characters appear at variable rates.
 */
function getTypedCharCount(
  elapsed: number,
  duration: number,
  text: string,
): number {
  if (elapsed >= duration) return text.length;
  if (elapsed <= 0 || text.length === 0) return 0;

  const weights = getCharWeights(text);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const targetWeight = (elapsed / duration) * totalWeight;

  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (cumulative > targetWeight) return i;
  }
  return text.length;
}

export function computeEditorState(
  frame: number,
  segments: Segment[],
): EditorState {
  let text = "";
  let dropdownItems: EmojiItem[] | null = null;
  let isTyping = false;
  let lastTypingEndFrame = 0;

  for (const seg of segments) {
    if (frame < seg.startFrame) break;

    if (seg.type === "type") {
      const elapsed = frame - seg.startFrame;
      const progress = Math.min(1, elapsed / seg.durationInFrames);
      const chars = getTypedCharCount(elapsed, seg.durationInFrames, seg.text);
      text += seg.text.slice(0, chars);
      if (progress < 1) {
        isTyping = true;
      } else {
        lastTypingEndFrame = seg.startFrame + seg.durationInFrames;
      }
    } else if (seg.type === "select") {
      text =
        text.slice(0, Math.max(0, text.length - seg.replaceLength)) +
        seg.insertText;
      lastTypingEndFrame = seg.startFrame;
    }

    // Update dropdown: segments with items show them; "select" hides
    if (seg.dropdownItems.length > 0) {
      dropdownItems = seg.dropdownItems;
    } else if (seg.type === "select") {
      dropdownItems = null;
    }
  }

  // If currently typing, the blink resets from "now"
  if (isTyping) {
    lastTypingEndFrame = frame;
  }

  return { text, dropdownItems, lastTypingEndFrame };
}
