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
      const chars = Math.floor(progress * seg.text.length);
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
