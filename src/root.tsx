import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./composition";
import { CodeEditorProps, codeEditorSchema } from "./code-editor";
import { generateLineTimings } from "./typing";

const defaultCode = `import React from "react";

export const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Hello, World!</h1>
    </div>
  );
};`;

const defaultLines = defaultCode.split("\n");
const defaultLineTimings = generateLineTimings(defaultLines);

const calculateMetadata = ({ props }: { props: CodeEditorProps }) => {
  const lines = props.code.split("\n");

  let lineTimings = props.lineTimings;
  if (lineTimings.length !== lines.length) {
    lineTimings = generateLineTimings(lines);
  }

  const durationInFrames =
    Math.max(...lineTimings.map((t) => t.startFrame + t.durationInFrames), 1) +
    30;

  return {
    durationInFrames,
    props: {
      ...props,
      lineTimings,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        schema={codeEditorSchema}
        defaultProps={{
          backgroundImage: "background.png",
          filename: "App.tsx",
          code: defaultCode,
          lineTimings: defaultLineTimings,
        }}
        calculateMetadata={calculateMetadata}
        fps={30}
        width={1140}
        height={850}
      />
    </>
  );
};
