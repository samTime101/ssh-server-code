
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import EditQuestionForm from "@/pages/admin/EditQuestionPage";
import { X } from "lucide-react";

// model ko state, question 
interface QuestionEditModalProps {
    editModalOpen: boolean;
    setEditModalOpen: (open: boolean) => void;
    selectedQuestion: any;
    handleEditSuccess: () => void;
}

const QuestionEditModal = ({ editModalOpen, setEditModalOpen, selectedQuestion, handleEditSuccess }: QuestionEditModalProps) => {
    return (
        /*
        References:
        @see:   https://www.radix-ui.com/primitives/docs/components/dialog#examples -> Dialog,Root
        @see:   https://www.youtube.com/watch?v=KvZoBV_1yYE                         -> Dialog.content
        @see:   https://www.radix-ui.com/primitives/docs/components/dialog          -> Dialog.Overlay Dialog.Close
        */
        <Dialog.Root open={editModalOpen} onOpenChange={setEditModalOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-animate-overlayShow" />
                
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 w-1/2 max-h-[90vh] overflow-y-auto">
                    <Dialog.Title className="text-xl font-semibold mb-4">
                        Edit Question
                    </Dialog.Title>
                    {selectedQuestion && (  
                        <EditQuestionForm selectedQuestion={selectedQuestion} handleEditSuccess={handleEditSuccess}/>
                    )}

                    <Dialog.Close asChild>
                        <Button
                            variant="secondary"
                            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full w-7 h-7"
                        >
                            <X size={16} />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default QuestionEditModal;