import type { OutputData } from "@editorjs/editorjs";

interface EditorRendererProps {
  data: string;
  className?: string;
}

type Block = OutputData["blocks"][number];

function renderBlock(block: Block) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={block.id}
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );

    case "header": {
      const level = block.data.level as number;
      const sizeClass = level <= 2 ? "text-base" : "text-sm";
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <Tag
          key={block.id}
          className={`font-bold ${sizeClass}`}
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );
    }

    case "list": {
      const style = block.data.style as string;
      type ListItem =
        | string
        | { content: string; meta?: { checked?: boolean }; items?: ListItem[] };
      const extractContent = (item: ListItem): string =>
        typeof item === "string" ? item : (item.content ?? "");
      const isChecked = (item: ListItem): boolean =>
        typeof item !== "string" && !!item.meta?.checked;

      if (style === "checklist") {
        return (
          <ul key={block.id} className="space-y-1 text-sm">
            {(block.data.items as ListItem[]).map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked(item)}
                  readOnly
                  className="accent-primary h-4 w-4 shrink-0"
                />
                <span dangerouslySetInnerHTML={{ __html: extractContent(item) }} />
              </li>
            ))}
          </ul>
        );
      }

      const isOrdered = style === "ordered";
      const ListTag = isOrdered ? "ol" : "ul";
      return (
        <ListTag
          key={block.id}
          className={`ml-4 space-y-1 text-sm ${isOrdered ? "list-decimal" : "list-disc"}`}
        >
          {(block.data.items as ListItem[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: extractContent(item) }} />
          ))}
        </ListTag>
      );
    }

    default:
      return null;
  }
}

const EditorRenderer = ({ data, className }: EditorRendererProps) => {
  if (!data) return null;

  let parsed: OutputData;
  try {
    parsed = JSON.parse(data) as OutputData;
    if (!parsed?.blocks?.length) {
      return <p className={`text-sm leading-relaxed ${className ?? ""}`}>{data}</p>;
    }
  } catch {
    return <p className={`text-sm leading-relaxed ${className ?? ""}`}>{data}</p>;
  }

  return <div className={`space-y-2 ${className ?? ""}`}>{parsed.blocks.map(renderBlock)}</div>;
};

export default EditorRenderer;
