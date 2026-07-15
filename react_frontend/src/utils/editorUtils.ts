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

const listContentLength = (items?: ListItem[]): number => {
  if (!items?.length) return 0;
  return items.reduce((acc, item) => {
    if (typeof item === "string") return acc + item.length;
    return acc + (item.content?.length ?? 0) + listContentLength(item.items);
  }, 0);
};

export const getEditorContentLength = (value: string): number => {
  if (!value || !value.trim()) return 0;

  try {
    const parsed = JSON.parse(value) as OutputData;
    const blocks = parsed?.blocks ?? [];

    return blocks.reduce((total, block) => {
      if (block.type === "paragraph" || block.type === "header") {
        return total + ((block.data?.text as string | undefined)?.length ?? 0);
      }

      if (block.type === "list") {
        return total + listContentLength(block.data?.items as ListItem[] | undefined);
      }

      if (block.data && typeof block.data === "object") {
        return total + ((block.data as { text?: string }).text?.length ?? 0);
      }

      return total;
    }, 0);
  } catch {
    return value.length;
  }
};

export const isEditorContentLong = (value: string, threshold = 300): boolean =>
  getEditorContentLength(value) > threshold;

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
