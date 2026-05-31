import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditorField from "@/components/EditorField";
import EditorRenderer from "@/components/EditorRenderer";
import {
  createQuestionNote,
  deleteQuestionNote,
  listQuestionNotes,
  patchQuestionNote,
} from "@/services/user/note-service";
import { isEditorContentEmpty } from "@/utils/editorUtils";

type QuestionNotePanelProps = {
  questionId: string;
};

const QuestionNotePanel = ({ questionId }: QuestionNotePanelProps) => {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteDeleting, setNoteDeleting] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadNotes = async () => {
      setNoteLoading(true);
      setNoteId(null);
      setNoteValue("");
      setNoteDraft("");
      setIsEditingNote(false);

      try {
        const response = await listQuestionNotes(questionId);
        if (cancelled) return;

        const note = response?.results?.[0] ?? null;
        if (note) {
          setNoteId(note.id);
          setNoteValue(note.note ?? "");
          setNoteDraft(note.note ?? "");
        }
      } catch (error) {
        if (!cancelled) toast.error("Failed to load notes");
      } finally {
        if (!cancelled) setNoteLoading(false);
      }
    };

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const handleSaveNote = async () => {
    if (isEditorContentEmpty(noteDraft)) {
      toast.error("Note cannot be empty");
      return;
    }

    setNoteSaving(true);
    try {
      if (noteId) {
        const updated = await patchQuestionNote(questionId, noteId, { note: noteDraft });
        const nextValue = updated?.note ?? noteDraft;
        setNoteValue(nextValue);
        setNoteDraft(nextValue);
        toast.success("Note updated");
      } else {
        const created = await createQuestionNote(questionId, { note: noteDraft });
        const nextValue = created?.note ?? noteDraft;
        setNoteId(created?.id ?? null);
        setNoteValue(nextValue);
        setNoteDraft(nextValue);
        toast.success("Note saved");
      }
      setIsEditingNote(false);
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteId) return;
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) return;

    setNoteDeleting(true);
    try {
      const ok = await deleteQuestionNote(questionId, noteId);
      if (!ok) {
        toast.error("Failed to delete note");
        return;
      }
      setNoteId(null);
      setNoteValue("");
      setNoteDraft("");
      setIsEditingNote(false);
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setNoteDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setNoteDraft(noteValue);
    setIsEditingNote(false);
  };

  const showNoteEmptyState = !noteId && !isEditingNote;
  const showNoteEditor = isEditingNote;
  const showNoteViewer = Boolean(noteId) && !isEditingNote;

  return (
    <Card className="shadow-lg lg:sticky lg:top-6">
      <CardHeader>
        <h3 className="text-foreground text-lg font-semibold">Notes</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {noteLoading ? (
          <p className="text-muted-foreground text-sm">Loading notes...</p>
        ) : (
          <>
            {showNoteEmptyState && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">No notes yet for this question.</p>
                <Button size="sm" onClick={() => setIsEditingNote(true)}>
                  Add Note
                </Button>
              </div>
            )}

            {showNoteEditor && (
              <div className="space-y-3">
                <div className="note-editor">
                  <EditorField
                    key={`note-${questionId}`}
                    value={noteDraft}
                    onChange={setNoteDraft}
                    placeholder="Write your note here..."
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={handleSaveNote} disabled={noteSaving || noteDeleting}>
                    {noteSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={noteId ? handleCancelEdit : () => setNoteDraft("")}
                    disabled={noteSaving || noteDeleting}
                  >
                    {noteId ? "Cancel" : "Clear"}
                  </Button>
                  {noteId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-white"
                      onClick={handleDeleteNote}
                      disabled={noteSaving || noteDeleting}
                    >
                      {noteDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {showNoteViewer && (
              <div className="space-y-3">
                <EditorRenderer data={noteValue} className="text-foreground" />
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditingNote(true)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-white"
                    onClick={handleDeleteNote}
                    disabled={noteDeleting}
                  >
                    {noteDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionNotePanel;
