import { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/KodeMono";
import { computeEditorState } from "./typing";

const { fontFamily } = loadFont();

const emojiItemSchema = z.object({
  emoji: z.string(),
  name: z.string(),
});

const segmentSchema = z.object({
  type: z.enum(["type", "pause", "select"]),
  text: z.string(),
  replaceLength: z.number().min(0).step(1),
  insertText: z.string(),
  startFrame: z.number().min(0).step(1),
  durationInFrames: z.number().min(1).step(1),
  dropdownItems: z.array(emojiItemSchema),
});

export const codeEditorSchema = z.object({
  backgroundImage: z.string(),
  filename: z.string(),
  segments: z.array(segmentSchema),
});

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;

export const CodeEditor: React.FC<CodeEditorProps> = ({
  backgroundImage,
  filename,
  segments,
}) => {
  const frame = useCurrentFrame();
  const { text, dropdownItems, lastTypingEndFrame } = useMemo(
    () => computeEditorState(frame, segments),
    [frame, segments],
  );

  // Cursor always visible during typing; blink resets when typing stops
  const framesSinceTyping = frame - lastTypingEndFrame;
  const cursorVisible = framesSinceTyping < 15 || Math.floor(framesSinceTyping / 15) % 2 === 0;

  // Find ":" position for dropdown placement
  const colonIndex = dropdownItems ? text.lastIndexOf(":") : -1;
  const showDropdown =
    dropdownItems !== null && dropdownItems.length > 0 && colonIndex !== -1;

  return (
    <AbsoluteFill>
      {/* Sequence bars for timeline visualization */}
      {segments.map((seg, i) => {
        let label: string;
        if (seg.type === "type") {
          const displayText = seg.text === " " ? "(space)" : seg.text;
          label = `Type: ${displayText}`;
        } else if (seg.type === "pause") {
          label = "Pause";
        } else {
          label = `Select: ${seg.insertText}`;
        }
        return (
          <Sequence
            key={i}
            layout="none"
            name={label}
            from={seg.startFrame}
            durationInFrames={seg.durationInFrames}
          >
            <></>
          </Sequence>
        );
      })}

      {/* Background image */}
      <AbsoluteFill>
        <Img
          src={staticFile(backgroundImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Centered editor window */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 969,
            height: 722,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: "#fbfaf9",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Traffic light dots */}
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#dddedc",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#dddedc",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#dddedc",
                }}
              />
            </div>

            {/* Filename centered with modified indicator */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 13,
                color: "#666",
                fontFamily,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {filename}
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#c0c0c0",
                }}
              />
            </div>
          </div>

          {/* Editor body */}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: "#fbfaf9",
              padding: "20px 0",
              fontFamily,
              fontSize: 21,
              lineHeight: "36px",
            }}
          >
            {/* Active line */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                backgroundColor: "#f1f2f1",
                padding: "0 24px",
              }}
            >
              <span style={{ color: "#1f2937", whiteSpace: "pre" }}>
                {text}
              </span>
              {cursorVisible && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2.5,
                    backgroundColor: "#14b8a6",
                    marginLeft: 1,
                  }}
                />
              )}
            </div>

            {/* Emoji dropdown */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: 56,
                  left: `calc(24px + ${colonIndex}ch)`,
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 3,
                  overflow: "hidden",
                  minWidth: 200,
                  zIndex: 10,
                  padding: 4,
                }}
              >
                {dropdownItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0px 14px",
                      backgroundColor: i === 0 ? "#d0e5e1" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <span
                      style={{
                        fontSize: 18,
                        color: i === 0 ? "#1a1a1a" : "#999",
                        fontWeight: i === 0 ? 600 : 400,
                        fontFamily,
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
