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

export type LineTiming = {
  startFrame: number;
  durationInFrames: number;
};

export function generateLineTimings(
  lines: string[],
  typingSpeed = 1.5,
  pauseGap = 8,
): LineTiming[] {
  const timings: LineTiming[] = [];
  let currentFrame = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const duration =
      line.length > 0 ? Math.ceil(line.length / typingSpeed) : 1;

    timings.push({ startFrame: currentFrame, durationInFrames: duration });

    currentFrame += duration;

    // Add gap after non-empty lines (except the last line)
    if (line.length > 0 && i < lines.length - 1) {
      currentFrame += pauseGap;
    }
  }

  return timings;
}

export function getVisibleLines(
  frame: number,
  lines: string[],
  timings: LineTiming[],
): (string | null)[] {
  return lines.map((line, i) => {
    const timing = timings[i];
    if (!timing || frame < timing.startFrame) return null;

    const elapsed = frame - timing.startFrame;
    const progress = Math.min(1, elapsed / timing.durationInFrames);
    const chars = Math.floor(progress * line.length);
    return line.slice(0, chars);
  });
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
