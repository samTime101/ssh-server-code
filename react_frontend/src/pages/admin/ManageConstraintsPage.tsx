import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { MinusCircle, PenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useManageConstraints } from "@/hooks/admin/useManageConstraints";

const ManageConstraintsPage = () => {
  const {
    constraints,
    categories,
    isLoading,
    isFormOpen,
    editingConstraint,
    name,
    setName,
    rules,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    addRule,
    updateRule,
    removeRule,
    handleSubmit,
    handleDelete,
  } = useManageConstraints();

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Constraints</h1>
          <p className="text-muted-foreground mt-1">
            Create constraint rules for question sets and keep them up to date.
          </p>
        </div>

        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Constraint
        </Button>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>{isLoading ? "" : `Total constraints: ${constraints.length}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rules</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={3} />
            ) : constraints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No constraints found
                </TableCell>
              </TableRow>
            ) : (
              constraints.map((constraint) => (
                <TableRow key={constraint.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">{constraint.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {constraint.rules.map((rule) => (
                        <Badge key={rule.categoryId} variant="secondary">
                          {rule.categoryName || categoryNameById.get(rule.categoryId) || "Category"}
                          : {rule.count}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(constraint)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(constraint)}
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
        title={editingConstraint ? "Edit Constraint" : "Create Constraint"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Constraint name"
            required
            autoFocus
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Rules</p>
              <Button type="button" variant="outline" size="sm" onClick={addRule}>
                <PlusIcon size={14} />
                Add Rule
              </Button>
            </div>

            {rules.map((rule, index) => (
              <div
                key={`rule-${index}`}
                className="border-border bg-muted/30 flex flex-col gap-3 rounded-md border p-3 md:flex-row"
              >
                <Select
                  value={rule.categoryId}
                  onValueChange={(value) => updateRule(index, { categoryId: value })}
                >
                  <SelectTrigger className="md:w-64">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min={1}
                  value={rule.count}
                  onChange={(e) => updateRule(index, { count: e.target.value })}
                  placeholder="Count"
                  className="md:w-40"
                />

                <Button type="button" variant="ghost" size="icon" onClick={() => removeRule(index)}>
                  <MinusCircle size={16} />
                </Button>
              </div>
            ))}
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

export default ManageConstraintsPage;
