'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Overlay } from './overlay';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@clerk/clerk-react';
import { Footer } from './footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Actions } from '@/components/actions';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface BoardCardProps {
    id: string;
    title: string;
    imageUrl: string;
    authorName: string;
    authorId: string;
    orgId: string;
    isFavorite: boolean;
    createdAt: number;
}

export const BoardCard = ({
    id,
    title,
    imageUrl,
    authorName,
    authorId,
    isFavorite,
    createdAt,
}: BoardCardProps) => {
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? 'You' : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
    const [hovering, setHovering] = useState(false);
    return (
        <Link
            href={`/canvas/board/${id}`}
            className="overflow-hidden rounded-lg shadow hover:shadow-lg"
        >
            <div
                className="group aspect-[70/90] border rounded-lg flex flex-col overflow-hidden justify-between"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <div className="relative flex-1 bg-blue-50">
                    <Image
                        fill
                        src={imageUrl}
                        alt={title}
                        className="object-cover"
                    />
                    <Overlay />
                    <Actions
                        id={id}
                        title={title}
                        side="right"
                        align="end"
                        sideOffset={12}
                    >
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => {}}
                    disabled={false}
                    boardId={id}
                    hovering={hovering}
                />
            </div>
        </Link>
    );
};

BoardCard.skeleton = () => {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full " />
        </div>
    );
};

export default BoardCard;