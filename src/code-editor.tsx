import { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { buildTimeline, codeToActions, getVisibleText } from "./typing";

export const codeEditorSchema = z.object({
  backgroundImage: z.string(),
  filename: z.string(),
  code: z.string(),
  typingSpeed: z.number().min(0.1).max(5).step(0.1),
  pauseAfterLine: z.number().min(0).max(30).step(1),
});

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;

export const CodeEditor: React.FC<CodeEditorProps> = ({
  backgroundImage,
  filename,
  code,
  typingSpeed,
  pauseAfterLine,
}) => {
  const frame = useCurrentFrame();
  const actions = useMemo(
    () => codeToActions(code, typingSpeed, pauseAfterLine),
    [code, typingSpeed, pauseAfterLine],
  );
  const timeline = useMemo(() => buildTimeline(actions), [actions]);
  const visibleText = getVisibleText(frame, timeline);
  const visibleLines = visibleText.split("\n");
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const activeLineIndex = visibleLines.length - 1;

  return (
    <AbsoluteFill>
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
            {visibleLines.map((line, index) => {
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
                    {line}
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
