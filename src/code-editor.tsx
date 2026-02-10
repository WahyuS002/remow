import { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { getVisibleLines } from "./typing";

export const codeEditorSchema = z.object({
  backgroundImage: z.string(),
  filename: z.string(),
  code: z.string(),
  lineTimings: z.array(
    z.object({
      startFrame: z.number().min(0).step(1),
      durationInFrames: z.number().min(1).step(1),
    }),
  ),
});

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;

export const CodeEditor: React.FC<CodeEditorProps> = ({
  backgroundImage,
  filename,
  code,
  lineTimings,
}) => {
  const frame = useCurrentFrame();
  const lines = useMemo(() => code.split("\n"), [code]);
  const visibleLines = useMemo(
    () => getVisibleLines(frame, lines, lineTimings),
    [frame, lines, lineTimings],
  );

  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // Find the last line that has started typing (for cursor placement)
  let activeLineIndex = -1;
  for (let i = visibleLines.length - 1; i >= 0; i--) {
    if (visibleLines[i] !== null) {
      activeLineIndex = i;
      break;
    }
  }

  return (
    <AbsoluteFill>
      {/* Sequence bars for timeline visualization */}
      {lines.map((line, i) => {
        const timing = lineTimings[i];
        if (!timing) return null;
        const label = line.trim()
          ? `Line ${i + 1}: ${line.trim().slice(0, 40)}`
          : `Line ${i + 1}: (empty)`;
        return (
          <Sequence
            key={i}
            layout="none"
            name={label}
            from={timing.startFrame}
            durationInFrames={timing.durationInFrames}
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
            width: 900,
            height: 400,
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
              background: "#e8e8e8",
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
                  backgroundColor: "#c0c0c0",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#c0c0c0",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#c0c0c0",
                }}
              />
            </div>

            {/* Filename centered */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 13,
                color: "#666",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {filename}
            </div>
          </div>

          {/* Editor body */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              padding: "16px 0",
              fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
              fontSize: 14,
              lineHeight: "24px",
            }}
          >
            {visibleLines.map((lineText, index) => {
              if (lineText === null) return null;
              const isActive = index === activeLineIndex;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    backgroundColor: isActive ? "#f3f4f6" : "transparent",
                    padding: "0 20px",
                  }}
                >
                  <span style={{ color: "#1f2937", whiteSpace: "pre" }}>
                    {lineText}
                    {isActive && cursorVisible && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 2,
                          height: 18,
                          backgroundColor: "#14b8a6",
                          marginLeft: 1,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
