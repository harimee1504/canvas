import { v } from 'convex/values';
import { query } from '../convex/_generated/server';
import { Id } from './_generated/dataModel';
import { getAllOrThrow } from 'convex-helpers/server/relationships';

interface BoardProps {
    _id: Id<'boards'>;
    _creationTime: number;
    title: string;
    orgId: string;
    authorId: string;
    authorName: string;
    imageUrl: string;
    isFavorite?: boolean;
}

type BoardListProps = BoardProps[];

export const getBoards = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }
        let boards: BoardListProps = [];
        if (args.favorites) {
            const favoriteBoard = await ctx.db
                .query('userFavorites')
                .withIndex('by_user_org', (q) =>
                    q.eq('userId', identity.subject).eq('orgId', args.orgId)
                )
                .order('desc')
                .collect();

            const boardIds = favoriteBoard.map((board) => board.boardId);
            boards = await getAllOrThrow(ctx.db, boardIds);

            return boards.map((board) => ({ ...board, isFavorite: true }));
        }

        const title = args.search;
        if (title) {
            boards = await ctx.db
                .query('boards')
                .withSearchIndex('search_title', (q) =>
                    q.search('title', title).eq('orgId', args.orgId)
                )
                .collect();
        } else {
            boards = await ctx.db
                .query('boards')
                .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
                .order('desc')
                .collect();
        }

        const boardWithFavorite = await Promise.all(
            boards.map(async (board) => {
                const isFavorite = await ctx.db
                    .query('userFavorites')
                    .withIndex('by_user_board_org', (q) =>
                        q
                            .eq('userId', identity.subject)
                            .eq('boardId', board._id)
                            .eq('orgId', args.orgId)
                    )
                    .first();
                return { ...board, isFavorite: !!isFavorite };
            })
        );

        return boardWithFavorite;
    },
});
