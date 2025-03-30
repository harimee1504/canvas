'uses client';

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from './ui/dropdown-menu';
import { Link2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';
import ConfirmModal from './modal/confirm-modal';
import { Button } from './ui/button';
import { useInputModal } from '@/store/use-rename-modal';

import {} from '@liveblocks/client';

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps['side'];
    align?: DropdownMenuContentProps['align'];
    sideOffset?: DropdownMenuContentProps['sideOffset'];
    alignOffset?: DropdownMenuContentProps['alignOffset'];
    id: string;
    title: string;
}

export const Actions = ({
    children,
    side,
    align,
    sideOffset,
    alignOffset,
    id,
    title,
}: ActionsProps) => {
    const { onOpen } = useInputModal();
    const { mutate, loading } = useApiMutation(api.board.deleteBoard);

    const deleteBoard = () => {
        mutate({
            id,
        })
            .then(() => {
                toast.success('Board deleted successfully');
            })
            .catch((error) => {
                console.error(error);
                toast.error('Failed to delete board');
            });
    };
    const copyLink = () => {
        navigator.clipboard
            .writeText(
                `
        ${window.location.origin}/canvas/board/${id}
            `
            )
            .then(() => {
                toast.success('Link copied to clipboard');
            })
            .catch((error) => {
                toast.error(error);
            });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                onClick={(e) => e.stopPropagation()}
                className="w-56"
            >
                <DropdownMenuItem
                    onClick={copyLink}
                    className="p-3 cursor-pointer"
                >
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy Link
                </DropdownMenuItem>
                <ConfirmModal
                    title="Delete Board"
                    description="Are you sure you want to delete this board?"
                    onConfirm={deleteBoard}
                    disabled={loading}
                >
                    <Button
                        variant="ghost"
                        className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </ConfirmModal>
                <DropdownMenuItem
                    onClick={() => onOpen(id, title, 'Rename Canvas', 'update')}
                    className="p-3 cursor-pointer"
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
