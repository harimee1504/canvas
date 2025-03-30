import { query } from './_generated/server';

export const getUserIdentity = query({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();

        if (user === null) {
            return null;
        }

        return user.tokenIdentifier;
    },
});
