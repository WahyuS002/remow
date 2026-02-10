import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./composition";
import { CodeEditorProps, codeEditorSchema } from "./code-editor";
import type { Segment } from "./typing";

const defaultSegments: Segment[] = [
  {
    type: "type",
    text: "Hello",
    replaceLength: 0,
    insertText: "",
    startFrame: 0,
    durationInFrames: 24,
    dropdownItems: [],
  },
  {
    type: "type",
    text: " ",
    replaceLength: 0,
    insertText: "",
    startFrame: 24,
    durationInFrames: 3,
    dropdownItems: [],
  },
  {
    type: "type",
    text: ":",
    replaceLength: 0,
    insertText: "",
    startFrame: 27,
    durationInFrames: 1,
    dropdownItems: [
      { emoji: "💕", name: "ty" },
      { emoji: "🙏", name: "blob pray" },
      { emoji: "🖤", name: "black heart" },
      { emoji: "🤣", name: "lol" },
      { emoji: "👍", name: "thumbs up" },
      { emoji: "🆒", name: "nice" },
      { emoji: "🙏", name: "prayer hands" },
      { emoji: "👀", name: "eyes" },
      { emoji: "🐸", name: "frog wave" },
      { emoji: "😅", name: "sweat smile" },
    ],
  },
  {
    type: "pause",
    text: "",
    replaceLength: 0,
    insertText: "",
    startFrame: 28,
    durationInFrames: 20,
    dropdownItems: [],
  },
  {
    type: "type",
    text: "wa",
    replaceLength: 0,
    insertText: "",
    startFrame: 48,
    durationInFrames: 6,
    dropdownItems: [
      { emoji: "👋", name: "wave" },
      { emoji: "🐸", name: "frog wave" },
      { emoji: "😅", name: "sweat smile" },
    ],
  },
  {
    type: "pause",
    text: "",
    replaceLength: 0,
    insertText: "",
    startFrame: 54,
    durationInFrames: 15,
    dropdownItems: [],
  },
  {
    type: "type",
    text: "ve",
    replaceLength: 0,
    insertText: "",
    startFrame: 69,
    durationInFrames: 6,
    dropdownItems: [
      { emoji: "👋", name: "wave" },
      { emoji: "🐸", name: "frog wave" },
    ],
  },
  {
    type: "pause",
    text: "",
    replaceLength: 0,
    insertText: "",
    startFrame: 75,
    durationInFrames: 15,
    dropdownItems: [],
  },
  {
    type: "select",
    text: "",
    replaceLength: 5,
    insertText: "👋",
    startFrame: 90,
    durationInFrames: 1,
    dropdownItems: [],
  },
];

const calculateMetadata = ({ props }: { props: CodeEditorProps }) => {
  const durationInFrames =
    props.segments.length > 0
      ? Math.max(
          ...props.segments.map((s) => s.startFrame + s.durationInFrames),
        ) + 30
      : 60;
  return { durationInFrames };
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
          filename: "playground/text.mdx",
          segments: defaultSegments,
        }}
        calculateMetadata={calculateMetadata}
        fps={30}
        width={1140}
        height={850}
      />
    </>
  );
};
