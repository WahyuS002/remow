import { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { type Action, buildTimeline, getVisibleText } from "./typing";

const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("type"), text: z.string(), speed: z.number().optional() }),
  z.object({ type: z.literal("wait"), frames: z.number() }),
  z.object({ type: z.literal("newline") }),
]);

export const codeEditorSchema = z.object({
  backgroundImage: z.string(),
  filename: z.string(),
  actions: z.array(actionSchema),
});

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;

export const CodeEditor: React.FC<CodeEditorProps> = ({
  backgroundImage,
  filename,
  actions,
}) => {
  const frame = useCurrentFrame();
  const timeline = useMemo(() => buildTimeline(actions as Action[]), [actions]);
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
                  backgroundColor: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#28c840",
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
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#999",
                }}
              />
              {filename}
            </div>
          </div>

          {/* Editor body */}
          <div
            style={{
              background: "#ffffff",
              padding: "16px 0",
              fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
              fontSize: 14,
              lineHeight: "24px",
            }}
          >
            {visibleLines.map((line, index) => {
              const lineNumber = index + 1;
              const isActive = index === activeLineIndex;

              return (
                <div
                  key={lineNumber}
                  style={{
                    display: "flex",
                    backgroundColor: isActive ? "#f3f4f6" : "transparent",
                    padding: "0 20px",
                  }}
                >
                  {/* Line number */}
                  <span
                    style={{
                      width: 40,
                      textAlign: "right",
                      color: "#9ca3af",
                      marginRight: 20,
                      userSelect: "none",
                      flexShrink: 0,
                    }}
                  >
                    {lineNumber}
                  </span>

                  {/* Code content */}
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
