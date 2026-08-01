import { useCallback, useEffect, useId, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import { useScrollOverflow } from "@/hooks/useScrollOverflow";
import { ScrollIndicators } from "@/components/ui/scroll-indicators";

interface EditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function parseEditorValue(v: string): OutputData | undefined {
  if (!v) return undefined;
  try {
    const parsed = JSON.parse(v) as OutputData;
    if (parsed?.blocks) return parsed;
  } catch {}
  return { blocks: [{ type: "paragraph", data: { text: v } }] };
}

const scrollCaretIntoView = (holder: HTMLElement) => {
  const holderRect = holder.getBoundingClientRect();
  const padding = 28;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (holder.contains(range.commonAncestorContainer)) {
      const caretRect = range.getBoundingClientRect();
      if (caretRect.height > 0 || caretRect.width > 0) {
        if (caretRect.bottom > holderRect.bottom - padding) {
          holder.scrollTop += caretRect.bottom - holderRect.bottom + padding;
          return;
        }
        if (caretRect.top < holderRect.top + padding) {
          holder.scrollTop -= holderRect.top + padding - caretRect.top;
          return;
        }
      }
    }
  }

  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !holder.contains(active)) return;

  const block = active.closest(".ce-block") ?? active;
  if (!(block instanceof HTMLElement)) return;

  const blockRect = block.getBoundingClientRect();
  if (blockRect.bottom > holderRect.bottom - padding) {
    holder.scrollTop += blockRect.bottom - holderRect.bottom + padding;
  } else if (blockRect.top < holderRect.top + padding) {
    holder.scrollTop -= holderRect.top + padding - blockRect.top;
  }
};

const scheduleScrollCaretIntoView = (holder: HTMLElement | null) => {
  if (!holder) return;
  requestAnimationFrame(() => {
    scrollCaretIntoView(holder);
    requestAnimationFrame(() => scrollCaretIntoView(holder));
  });
};

const EditorField = ({
  value,
  onChange,
  placeholder = "Enter description...",
}: EditorFieldProps) => {
  const rawId = useId();
  const holderId = rawId.replace(/:/g, "ej-");

  const holderElRef = useRef<HTMLElement | null>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const destroyingRef = useRef<Promise<void> | null>(null);
  const isReadyRef = useRef(false);
  const lastEmittedRef = useRef<string>("");
  const pendingValueRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);

  const [overflowRef, { canScrollUp, canScrollDown }] = useScrollOverflow();

  // Must stay referentially stable, otherwise React detaches/reattaches the ref
  // on every render and the overflow hook re-runs in a loop.
  const setHolderRef = useCallback(
    (node: HTMLDivElement | null) => {
      holderElRef.current = node;
      overflowRef(node);
    },
    [overflowRef]
  );

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (destroyingRef.current) await destroyingRef.current;
      if (cancelled) return;

      const editor = new EditorJS({
        holder: holderId,
        tools: {
          header: Header,
          list: { class: List, inlineToolbar: true },
          underline: Underline,
        },
        placeholder,
        data: parseEditorValue(value),
        async onChange(api) {
          const output = await api.saver.save();
          const jsonStr = JSON.stringify(output);
          lastEmittedRef.current = jsonStr;
          onChangeRef.current(jsonStr);
          scheduleScrollCaretIntoView(holderElRef.current);
        },
      });

      editorRef.current = editor;
      await editor.isReady;
      if (!cancelled) {
        isReadyRef.current = true;
        if (pendingValueRef.current !== null) {
          const data = parseEditorValue(pendingValueRef.current);
          if (data) editor.render(data);
          pendingValueRef.current = null;
        }
      }
    };

    init().catch(() => {});

    return () => {
      cancelled = true;
      isReadyRef.current = false;
      const instance = editorRef.current;
      editorRef.current = null;
      if (instance) {
        destroyingRef.current = instance.isReady
          .then(() => instance.destroy())
          .catch(() => {})
          .finally(() => {
            destroyingRef.current = null;
          });
      }
    };
  }, [holderId]);

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    if (!editorRef.current || !isReadyRef.current) {
      pendingValueRef.current = value;
      return;
    }
    if (!value) {
      editorRef.current.clear();
      return;
    }
    const data = parseEditorValue(value);
    if (data) editorRef.current.render(data);
  }, [value]);

  useEffect(() => {
    const holder = holderElRef.current;
    if (!holder) return;

    const onKeyUp = () => scheduleScrollCaretIntoView(holder);

    holder.addEventListener("keyup", onKeyUp);
    return () => holder.removeEventListener("keyup", onKeyUp);
  }, []);

  return (
    <div className="relative">
      <div
        id={holderId}
        ref={setHolderRef}
        className="editor-field-holder scrollbar-hidden border-input text-foreground ring-offset-background focus-within:ring-ring bg-card max-h-60 min-h-[120px] w-full overflow-y-auto rounded-md border py-2 pr-3 pl-16 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none"
      />
      <ScrollIndicators canScrollUp={canScrollUp} canScrollDown={canScrollDown} />
    </div>
  );
};

export default EditorField;
