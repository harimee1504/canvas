'use client';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useInputModal } from '@/store/use-rename-modal';

interface NewBoardCardProps {
    orgId: string;
    disabled?: boolean;
}

export const NewBoardCard = ({ orgId, disabled }: NewBoardCardProps) => {
    const { onOpen } = useInputModal();
    return (
        <button
            disabled={disabled}
            onClick={() => onOpen(orgId, '', 'Create Canvas', 'create')}
            className={cn(
                'col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6',
                disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
            )}
        >
            <Plus className="w-6 h-6 text-white stroke-1" />
            <p className="text-sm text-white font-light pt-2">New Canvas</p>
        </button>
    );
};

export default NewBoardCard;