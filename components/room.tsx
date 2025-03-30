'use client';

import { ReactNode } from 'react';
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { Layer } from '@/types/canvas';

interface RoomProps {
    children: ReactNode;
    id: string;
    fallback: NonNullable<ReactNode>;
}

export function Room({ children, id, fallback }: RoomProps) {
    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
            <RoomProvider
                id={id}
                initialPresence={{
                    cursor: null,
                    selection: [],
                    pencilDraft: null,
                    penColor: null,
                }}
                initialStorage={{
                    layers: new LiveMap<string, LiveObject<Layer>>(),
                    layerIds: new LiveList<string>([]),
                }}
            >
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
