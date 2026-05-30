import type { OutputData } from "@editorjs/editorjs";

type ListItem = string | { content?: string; items?: ListItem[] };

const hasText = (value?: string | null): boolean => Boolean(value && value.trim());

const listHasContent = (items?: ListItem[]): boolean => {
  if (!items?.length) return false;
  return items.some((item) => {
    if (typeof item === "string") return hasText(item);
    return hasText(item.content) || listHasContent(item.items);
  });
};

export const isEditorContentEmpty = (value: string): boolean => {
  if (!value || !value.trim()) return true;

  try {
    const parsed = JSON.parse(value) as OutputData;
    const blocks = parsed?.blocks ?? [];
    if (!blocks.length) return true;

    return !blocks.some((block) => {
      if (block.type === "paragraph" || block.type === "header") {
        return hasText(block.data?.text as string | undefined);
      }

      if (block.type === "list") {
        return listHasContent(block.data?.items as ListItem[] | undefined);
      }

      if (block.data && typeof block.data === "object") {
        const possibleText = (block.data as { text?: string }).text;
        return hasText(possibleText);
      }

      return false;
    });
  } catch {
    return !hasText(value);
  }
};
