'use client';

import { memo } from 'react';
import {
    shallow,
    useOthersConnectionIds,
    useOthersMapped,
} from '@liveblocks/react/suspense';
import { Cursor } from './cursor';
import { Path } from '../layers/path';
import { colorToHex } from '@/lib/utils';

const Cursors = () => {
    const othersConnectionIds = useOthersConnectionIds();
    return (
        <>
            {othersConnectionIds.map((id) => (
                <Cursor key={id} id={id} />
            ))}
        </>
    );
};

export const Drafts = () => {
    const others = useOthersMapped(
        (other) => ({
            pencilDraft: other.presence.pencilDraft,
            penColor: other.presence.penColor,
        }),
        shallow
    );
    return (
        <>
            {others.map(([key, other]) => {
                if (other.pencilDraft) {
                    return (
                        <Path
                            key={key}
                            x={0}
                            y={0}
                            points={other.pencilDraft}
                            onPointerDown={() => null}
                            fill={colorToHex(other.penColor!)}
                            stroke={colorToHex(other.penColor!)}
                        />
                    );
                }
            })}
        </>
    );
};

export const CursorPresence = memo(() => {
    return (
        <>
            <Drafts />
            <Cursors />;
        </>
    );
});

CursorPresence.displayName = 'CursorPresence';
