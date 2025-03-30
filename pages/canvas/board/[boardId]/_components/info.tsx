'use client';
import { Actions } from '@/components/actions';
import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useInputModal } from '@/store/use-rename-modal';
import { useQuery } from 'convex/react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface InfoProps {
    boardId: string;
}

const PipeSeperator = () => {
    return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
    const { onOpen } = useInputModal();
    const board = useQuery(api.board.getBoard, { id: boardId as Id<'boards'> });
    if (!board) {
        return <InfoSkeleton />;
    }
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            <Hint label="Go to Canvas" sideOffset={10}>
                <Button className="px-2" variant={'board'} asChild>
                    <Link href="/canvas">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            height={40}
                            width={40}
                        />
                        <span className="font-semibold text-xl ml-2 text-black">
                            Canvas
                        </span>
                    </Link>
                </Button>
            </Hint>
            <PipeSeperator />
            <Hint label="Rename Canvas" sideOffset={10}>
                <Button
                    variant={'board'}
                    className="text-base font-normal px-2"
                    onClick={() =>
                        onOpen(
                            board._id,
                            board.title,
                            'Rename Canvas',
                            'update'
                        )
                    }
                >
                    {board.title[0].toLocaleUpperCase() + board.title.slice(1)}
                </Button>
            </Hint>
            <PipeSeperator />
            <Actions
                id={board._id}
                title={board.title}
                side="right"
                sideOffset={10}
            >
                <div>
                    <Hint label="More Options" sideOffset={10} side="right">
                        <Button
                            variant={'board'}
                            className="text-base font-normal px-2"
                        >
                            <Menu />
                        </Button>
                    </Hint>
                </div>
            </Actions>
        </div>
    );
};

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md animate-pulse w-[300px]">
            <Skeleton className="w-fuill h-full bg-muted-foreground" />
        </div>
    );
};
