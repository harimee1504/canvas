import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const imageUrl = [
    'canvas.svg'
];

export const create = mutation({
    args: {
        title: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }

        const randomImageUrl = imageUrl[(imageUrl.length * Math.random()) | 0];
        const board = await ctx.db.insert('boards', {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImageUrl,
        });
        return board;
    },
});

export const deleteBoard = mutation({
    args: {
        id: v.id('boards'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }
        const board = await ctx.db.delete(args.id);
        const document = await ctx.db
            .query('userFavorites')
            .withIndex('by_user_board', (q) =>
                q.eq('userId', identity.subject).eq('boardId', args.id)
            )
            .first();
        if (document) {
            await ctx.db.delete(document._id);
        }
        return board;
    },
});

export const updateBoard = mutation({
    args: {
        id: v.id('boards'),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }
        const title = args.title.trim();
        if (title.length === 0) {
            throw new Error('Title cannot be empty');
        }
        if (title.length > 40) {
            throw new Error('Title cannot be longer than 40 characters');
        }
        const board = await ctx.db.patch(args.id, {
            title: args.title,
        });
        return board;
    },
});

export const favoriteBoard = mutation({
    args: {
        boardId: v.id('boards'),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }
        const document = await ctx.db
            .query('userFavorites')
            .withIndex('by_user_board_org', (q) =>
                q
                    .eq('userId', identity.subject)
                    .eq('boardId', args.boardId)
                    .eq('orgId', args.orgId)
            )
            .first();
        if (document) {
            throw new Error('Already favorited');
        }
        const board = await ctx.db.insert('userFavorites', {
            boardId: args.boardId,
            orgId: args.orgId,
            userId: identity.subject,
        });
        return board;
    },
});

export const unfavoriteBoard = mutation({
    args: {
        boardId: v.id('boards'),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Not authorized');
        }
        const document = await ctx.db
            .query('userFavorites')
            .withIndex('by_user_board_org', (q) =>
                q
                    .eq('userId', identity.subject)
                    .eq('boardId', args.boardId)
                    .eq('orgId', args.orgId)
            )
            .first();
        if (!document) {
            throw new Error('Not found');
        }
        const board = await ctx.db.delete(document._id);
        return board;
    },
});

export const getBoard = query({
    args: {
        id: v.id('boards'),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.id);
        return board;
    },
});
