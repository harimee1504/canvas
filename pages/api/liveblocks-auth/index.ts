import jwt, { JwtPayload } from 'jsonwebtoken';

import { api } from '@/convex/_generated/api';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
    secret: API_KEY!,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // Get the current user from your database
    const { userId, getToken } = getAuth(request);

    if (!userId) {
        return response.status(401).send({ error: 'Not logged in' });
    }

    const user = await clerkClient().users.getUser(userId);
    const token = await getToken();

    if (!token) {
        return response.status(401).send({ error: 'Not authorized' });
    }

    const userIdentity = jwt.decode(token) as JwtPayload;

    const { room } = request.body;
    const board = await convex.query(api.board.getBoard, { id: room });

    if (board?.orgId !== userIdentity.org_id) {
        return response.status(401).send({ error: 'Not authorized' });
    }
    const userInfo = {
        name: user.firstName + ' ' + user.lastName,
        picture: user.imageUrl,
    };

    const session = liveblocks.prepareSession(user.id, { userInfo });

    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    response.status(status).send(body);
}
