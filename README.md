# remow

Copy-paste motion components for [Remotion](https://remotion.dev). Like [shadcn/ui](https://ui.shadcn.com), but for video.

Browse the components, pick what you need, and drop them into your Remotion project.

## Components

### Code Editor

A macOS-style code editor with typing animation, emoji autocomplete dropdown, and per-segment timeline control.

- Segment-based action system (type, pause, select)
- Non-linear typing for realistic variable-speed keystrokes
- Emoji dropdown with filtering and selection
- Each segment appears as a named Sequence bar in Remotion Studio
- Kode Mono font via `@remotion/google-fonts`

## Getting Started

```console
pnpm install
```

```console
pnpm dev
```

```console
pnpm exec remotion render
```

## How It Works

Each component is a self-contained Remotion composition with a zod schema for props. Edit timing, text, and styling directly in the Remotion Studio props panel — every segment is a `<Sequence>` you can see and adjust in the timeline.

## License

See [Remotion licensing](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) for details.
