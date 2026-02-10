import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { codeEditorSchema } from "./CodeEditor";

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
          code: [
            'import React from "react";',
            "",
            "export const App: React.FC = () => {",
            "  return (",
            '    <div className="app">',
            "      <h1>Hello, World!</h1>",
            "    </div>",
            "  );",
            "};",
          ],
          activeLine: 6,
        }}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
