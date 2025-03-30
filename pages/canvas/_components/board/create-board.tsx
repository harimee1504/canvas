import { useOrganization } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useInputModal } from '@/store/use-rename-modal';

export const CreateBoard = () => {
    const { organization } = useOrganization();
    const { onOpen } = useInputModal();
    if (!organization) return null;
    const { id } = organization;
    return (
        <Button
            size="lg"
            onClick={() => onOpen(id, '', 'Create Canvas', 'create')}
            className="p-3 cursor-pointer"
        >
            Create Board
        </Button>
    );
};
