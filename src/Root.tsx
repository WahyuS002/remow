import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { codeEditorSchema } from "./CodeEditor";
import { type Action, buildTimeline } from "./typing";

const actions: Action[] = [
  { type: "type", text: 'import React from "react";', speed: 1.5 },
  { type: "wait", frames: 8 },
  { type: "newline" },
  { type: "newline" },
  { type: "type", text: "export const App: React.FC = () => {", speed: 1.5 },
  { type: "wait", frames: 8 },
  { type: "newline" },
  { type: "type", text: "  return (", speed: 1.2 },
  { type: "wait", frames: 6 },
  { type: "newline" },
  { type: "type", text: '    <div className="app">', speed: 1.2 },
  { type: "wait", frames: 6 },
  { type: "newline" },
  { type: "type", text: "      <h1>Hello, World!</h1>", speed: 1 },
  { type: "wait", frames: 10 },
  { type: "newline" },
  { type: "type", text: "    </div>", speed: 1.5 },
  { type: "wait", frames: 6 },
  { type: "newline" },
  { type: "type", text: "  );", speed: 1.5 },
  { type: "wait", frames: 6 },
  { type: "newline" },
  { type: "type", text: "};", speed: 1.5 },
];

const timeline = buildTimeline(actions);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        schema={codeEditorSchema}
        defaultProps={{
          backgroundImage: "background.jpg",
          filename: "App.tsx",
          actions,
        }}
        durationInFrames={timeline.totalFrames + 30}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
