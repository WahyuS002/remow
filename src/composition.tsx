import { CodeEditor, CodeEditorProps } from "./code-editor";

export const MyComposition: React.FC<CodeEditorProps> = (props) => {
  return <CodeEditor {...props} />;
};
