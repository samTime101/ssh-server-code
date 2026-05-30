import { useEffect, useId, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";

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

const EditorField = ({
  value,
  onChange,
  placeholder = "Enter description...",
}: EditorFieldProps) => {
  const rawId = useId();
  const holderId = rawId.replace(/:/g, "ej-");

  const editorRef = useRef<EditorJS | null>(null);
  const destroyingRef = useRef<Promise<void> | null>(null);
  const isReadyRef = useRef(false);
  const lastEmittedRef = useRef<string>("");
  const pendingValueRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);

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

  return (
    <div
      id={holderId}
      className="editor-field-holder border-input text-foreground ring-offset-background focus-within:ring-ring bg-card min-h-[120px] w-full rounded-md border py-2 pr-3 pl-16 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none"
    />
  );
};

export default EditorField;
