export type TypeAction = { type: "type"; text: string; speed?: number };
export type WaitAction = { type: "wait"; frames: number };
export type NewlineAction = { type: "newline" };
export type Action = TypeAction | WaitAction | NewlineAction;

export type TimelineEntry = {
  startFrame: number;
  endFrame: number;
  action: Action;
};

export type Timeline = {
  entries: TimelineEntry[];
  totalFrames: number;
};

export function codeToActions(
  code: string,
  typingSpeed: number,
  pauseAfterLine: number,
): Action[] {
  const lines = code.split("\n");
  const actions: Action[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    actions.push({ type: "type", text: line, speed: typingSpeed });

    if (line.length > 0 && pauseAfterLine > 0) {
      actions.push({ type: "wait", frames: pauseAfterLine });
    }

    if (i < lines.length - 1) {
      actions.push({ type: "newline" });
    }
  }

  return actions;
}

export function buildTimeline(actions: Action[]): Timeline {
  let frame = 0;
  const entries: TimelineEntry[] = [];

  for (const action of actions) {
    let duration: number;
    if (action.type === "type") {
      duration = Math.ceil(action.text.length / (action.speed ?? 1));
    } else if (action.type === "wait") {
      duration = action.frames;
    } else {
      duration = 1;
    }
    entries.push({ startFrame: frame, endFrame: frame + duration, action });
    frame += duration;
  }

  return { entries, totalFrames: frame };
}

export function getVisibleText(frame: number, timeline: Timeline): string {
  let text = "";

  for (const entry of timeline.entries) {
    if (frame < entry.startFrame) break;

    if (entry.action.type === "type") {
      const duration = entry.endFrame - entry.startFrame;
      const progress = Math.min(1, (frame - entry.startFrame) / duration);
      const chars = Math.floor(progress * entry.action.text.length);
      text += entry.action.text.slice(0, chars);
    } else if (entry.action.type === "newline") {
      text += "\n";
    }
    // "wait" adds nothing
  }

  return text;
}
