'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useInputModal } from '@/store/use-rename-modal';
import { FormEventHandler, useEffect, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useOrganization } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

export const InputModal = () => {
    const { mutate: updateBoard } = useApiMutation(api.board.updateBoard);
    const { mutate: createBoard } = useApiMutation(api.board.create);
    const { isOpen, initialState, onClose } = useInputModal();
    const [title, setTitle] = useState(initialState.title);
    const router = useRouter();
    useEffect(() => {
        setTitle(initialState.title);
    }, [initialState.title]);

    const { organization } = useOrganization();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (initialState.action === 'create') {
            createBoard({ orgId: organization?.id, title })
                .then((id) => {
                    toast.success('Board created successfully');
                    router.push(`/canvas/board/${id}`);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('Failed to create board');
                })
                .finally(() => {
                    onClose();
                });
            return;
        }

        if (initialState.action === 'update') {
            updateBoard({ id: initialState.id, title })
                .then(() => {
                    toast.success('Board updated successfully');
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('Failed to update board');
                })
                .finally(() => {
                    onClose();
                });
            return;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="py-1">
                        {initialState.menuName}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={40}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
