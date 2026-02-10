import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./composition";
import { CodeEditorProps, codeEditorSchema } from "./code-editor";
import { buildTimeline, codeToActions } from "./typing";

const calculateMetadata = ({ props }: { props: CodeEditorProps }) => {
  const actions = codeToActions(props.code, props.typingSpeed, props.pauseAfterLine);
  const timeline = buildTimeline(actions);
  return {
    durationInFrames: timeline.totalFrames + 30,
  };
};

const defaultCode = `import React from "react";

export const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Hello, World!</h1>
    </div>
  );
};`;

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
          code: defaultCode,
          typingSpeed: 1.5,
          pauseAfterLine: 8,
        }}
        calculateMetadata={calculateMetadata}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
