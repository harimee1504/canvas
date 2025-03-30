'use client';

import { useQuery } from 'convex/react';
import { EmptyBoards } from './empty-boards';
import { EmptyFavorites } from './empty-favorites';
import { EmptySearch } from './empty-search';
import { api } from '@/convex/_generated/api';
import { BoardCard } from '../board-card';
import { NewBoardCard } from '../board-card/new-board';

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
    const data = useQuery(api.boards.getBoards, { orgId, ...query });

    if (data === undefined) {
        return (
            <div>
                <h2 className="text-2xl">
                    {query.favorites ? 'Favorite Canvas' : 'Team Canvas'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    <NewBoardCard orgId={orgId} disabled />

                    <BoardCard.skeleton />
                    <BoardCard.skeleton />
                    <BoardCard.skeleton />
                    <BoardCard.skeleton />
                </div>
            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch />;
    }
    if (!data?.length && query.favorites) {
        return <EmptyFavorites />;
    }

    if (!data?.length) {
        return <EmptyBoards />;
    }

    return (
        <div>
            <h2 className="text-2xl">
                {query.favorites ? 'Favorite Board' : 'Team Boards'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <NewBoardCard orgId={orgId} />
                {data?.map((board) => (
                    <BoardCard
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorName={board.authorName}
                        authorId={board.authorId}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        isFavorite={board.isFavorite}
                    />
                ))}
            </div>
        </div>
    );
};
