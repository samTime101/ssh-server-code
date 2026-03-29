import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import StatusBadge from "@/components/StatusBadge";
import { PenIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useManageQuestionSets } from "@/hooks/admin/useManageQuestionSets";

const ManageQuestionSetsPage = () => {
  const {
    sets,
    isLoading,
    isFormOpen,
    editingSet,
    name,
    setName,
    description,
    setDescription,
    selectedQuestionIds,
    selectedQuestionTextById,
    selectedCount,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,

    pickerQuestions,
    pickerSearch,
    setPickerSearch,
    pickerPage,
    setPickerPage,
    pickerPageSize,
    setPickerPageSize,
    pickerTotalPages,
    pickerTotalCount,
    isPickerLoading,
    isCurrentPageFullySelected,
    toggleQuestionSelection,
    toggleCurrentPageQuestions,
    removeSelectedQuestion,
  } = useManageQuestionSets();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Question Sets</h1>
          <p className="text-muted-foreground mt-1">
            Create sets, edit them, and assign one or multiple questions.
          </p>
        </div>

        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Set
        </Button>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>{isLoading ? "" : `Total sets: ${sets.length}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={4} />
            ) : sets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No question sets found
                </TableCell>
              </TableRow>
            ) : (
              sets.map((set) => (
                <TableRow key={set.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">{set.name}</TableCell>
                  <TableCell className="max-w-xl break-words whitespace-normal">
                    {set.description || "-"}
                  </TableCell>
                  <TableCell>{set.questions.length}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(set)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(set)}
                    >
                      <TrashIcon size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        title={editingSet ? "Edit Question Set" : "Create Question Set"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Set name"
            required
            autoFocus
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />

          <div className="border-border bg-muted/30 rounded-md border p-3">
            <p className="mb-2 text-sm font-medium">Selected Questions ({selectedCount})</p>

            {selectedQuestionIds.length === 0 ? (
              <p className="text-muted-foreground text-sm">No questions selected.</p>
            ) : (
              <div className="max-h-40 space-y-2 overflow-auto pr-1">
                {selectedQuestionIds.map((questionId) => (
                  <div
                    key={questionId}
                    className="bg-background flex items-start justify-between gap-2 rounded border px-2 py-1.5"
                  >
                    <p className="text-sm">
                      {selectedQuestionTextById.get(questionId) || "Selected question"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeSelectedQuestion(questionId)}
                    >
                      <XIcon size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <Input
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search questions to add"
              />

              <div className="border-border bg-card rounded-md border">
                <Table>
                  <TableCaption>
                    {isPickerLoading ? "" : `Total questions: ${pickerTotalCount}`}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isCurrentPageFullySelected}
                          onCheckedChange={() => toggleCurrentPageQuestions()}
                        />
                      </TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPickerLoading ? (
                      <TableSkeletonLoader rows={4} columns={3} />
                    ) : pickerQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No questions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pickerQuestions.map((question) => (
                        <TableRow key={question.id} className="text-muted-foreground">
                          <TableCell>
                            <Checkbox
                              checked={selectedQuestionIds.includes(question.id)}
                              onCheckedChange={() => toggleQuestionSelection(question.id)}
                            />
                          </TableCell>
                          <TableCell className="max-w-xl break-words whitespace-normal">
                            {question.question_text}
                          </TableCell>
                          <TableCell>
                            {question.status ? <StatusBadge status={question.status} /> : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <Paginator
                  currentPage={pickerPage}
                  totalPages={pickerTotalPages}
                  pageSize={pickerPageSize}
                  totalCount={pickerTotalCount}
                  onPageChange={setPickerPage}
                  onPageSizeChange={setPickerPageSize}
                  isLoading={isPickerLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageQuestionSetsPage;
