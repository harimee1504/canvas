'use client';

import { useSelectionBounds } from '@/hooks/use-selection-bounds';
import { ShapeType, Side, XYWH } from '@/types/canvas';
import { useSelf, useStorage } from '@liveblocks/react/suspense';
import { memo } from 'react';

interface SelectionBoxProps {
    onResize: (side: Side, init: XYWH) => void;
}
const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResize }: SelectionBoxProps) => {
    const layerId = useSelf((me) =>
        me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );
    const showHandle = useStorage((root) => {
        return layerId && root.layers.get(layerId)?.type !== ShapeType.Path;
    });
    const bounds = useSelectionBounds();

    if (!bounds) {
        return null;
    }

    return (
        <>
            <rect
                className="fill-transparent stroke-purple-500 stroke-1 pointer-events-none"
                style={{
                    transform: `translate(${bounds.x}px, ${bounds.y}px)`,
                }}
                x={0}
                y={0}
                width={bounds.width}
                height={bounds.height}
            />
            {showHandle && (
                <>
                    <rect
                        className="fill-white stoke-1 stroke-purple-500"
                        // side="top-left"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Top + Side.Left, bounds);
                        }}
                    />
                    <rect
                        className="fill-white stoke-1 stroke-purple-500"
                        // side="bottom-left"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Bottom + Side.Left, bounds);
                        }}
                    />
                    <rect
                        // side="bottom-right"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Bottom + Side.Right, bounds);
                        }}
                    />
                    <rect
                        // side="top-right"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Top + Side.Right, bounds);
                        }}
                    />
                    <rect
                        // side="top"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Top, bounds);
                        }}
                    />
                    <rect
                        // side="right"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Right, bounds);
                        }}
                    />
                    <rect
                        // side="left"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Left, bounds);
                        }}
                    />
                    <rect
                        // side="bottom"
                        className="fill-white stoke-1 stroke-purple-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResize(Side.Bottom, bounds);
                        }}
                    />
                </>
            )}
        </>
    );
});

SelectionBox.displayName = 'SelectionBox';
