'use client';

import { getColor } from '@/lib/utils';
import { useOther } from '@liveblocks/react/suspense';
import { MousePointer2 } from 'lucide-react';
import { memo } from 'react';

interface CursorProps {
    id: number;
}

export const Cursor = memo(({ id }: CursorProps) => {
    const userData = useOther(id, (user) => user);
    const outline = getColor(userData.id);
    const cursor = useOther(id, (user) => user.presence.cursor);
    const name = userData?.info?.name;
    if (!cursor) {
        return null;
    }

    const { x, y } = cursor;

    return (
        <foreignObject
            className="relative drop-shadow-md"
            height={50}
            width={name.length * 10 + 24}
            style={{
                transform: `translateX(${x}px) translateY(${y}px)`,
            }}
        >
            <MousePointer2
                className="h-5 w-5"
                style={{
                    fill: outline,
                    color: outline,
                }}
            />
            <div
                className="absolute rounded-md p-1.5 left-5 py-0.5 text-sm text-white font-semibold"
                style={{
                    backgroundColor: outline,
                }}
            >
                {name}
            </div>
        </foreignObject>
    );
});

Cursor.displayName = 'Cursor';
