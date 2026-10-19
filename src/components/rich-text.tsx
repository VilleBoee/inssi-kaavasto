import { clsx } from "clsx";

type Piece =
  | { kind: "text"; value: string }
  | { kind: "bold" | "italic" | "code" | "term"; value: string };

export function parseRich(text: string): Piece[] {
  const pieces: Piece[] = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("[[", i)) {
      const end = text.indexOf("]]", i + 2);
      if (end !== -1) {
        pieces.push({ kind: "term", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "`" || text[i] === "§") {
      const end = text.indexOf(text[i], i + 1);
      if (end !== -1) {
        pieces.push({ kind: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1 && !text.slice(i + 2, end).includes("\n")) {
        pieces.push({ kind: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*" && text[i + 1] !== " ") {
      const end = text.indexOf("*", i + 1);
      if (end > i + 1 && text[end - 1] !== " " && !text.slice(i + 1, end).includes("\n")) {
        pieces.push({ kind: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    let j = i + 1;
    while (j < text.length && text[j] !== "`" && text[j] !== "§" && text[j] !== "*" && !text.startsWith("[[", j)) j += 1;
    pieces.push({ kind: "text", value: text.slice(i, j) });
    i = j;
  }
  return pieces;
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((piece, index) => {
        if (piece.kind === "bold") {
          return (
            <strong key={index} className="font-semibold text-ink">
              {piece.value}
            </strong>
          );
        }
        if (piece.kind === "italic") return <em key={index}>{piece.value}</em>;
        if (piece.kind === "code") {
          return (
            <code key={index} className="rounded bg-bg px-1 font-mono text-sm text-accent">
              {piece.value}
            </code>
          );
        }
        if (piece.kind === "term") {
          return (
            <span key={index} className="font-medium text-accent">
              {piece.value}
            </span>
          );
        }
        return <span key={index}>{piece.value}</span>;
      })}
    </>
  );
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text
    .trim()
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  return (
    <div className={clsx("flex flex-col gap-3 text-base leading-relaxed text-pretty", className)}>
      {blocks.map((block, index) => {
        const callout = block.startsWith(">> ");
        const body = callout ? block.slice(3) : block;
        return (
          <p key={index} className={callout ? "rounded-md border-l-4 border-accent bg-accent-soft px-3 py-2 text-ink" : undefined}>
            <Inline text={body} />
          </p>
        );
      })}
    </div>
  );
}
