'use client';

import { useSelectionBounds } from '@/hooks/use-selection-bounds';
import { Camera, Color } from '@/types/canvas';
import { useMutation, useSelf } from '@liveblocks/react/suspense';
import { memo } from 'react';
import { Colors } from './options/colors';
import { useDeleteLayer } from '@/hooks/use-delete-layer';
import { Button } from '@/components/ui/button';
import { BringToFront, SendToBack, Trash2 } from 'lucide-react';
import { Hint } from '@/components/hint';

interface SelectionToolsProps {
    camera: Camera;
    setLastusedColor: (color: Color) => void;
}

export const SelectionTools = memo(
    ({ camera, setLastusedColor }: SelectionToolsProps) => {
        const selection = useSelf((me) => me.presence.selection);
        const deleteLayer = useDeleteLayer();

        const bringToFront = useMutation(
            ({ storage }) => {
                const liveLayerIds = storage.get('layerIds');
                const indices: number[] = [];
                const arr = liveLayerIds.toImmutable();
                arr.forEach((id, ind) => {
                    const index = selection.includes(id);
                    if (index) {
                        indices.push(ind);
                    }
                });

                for (let i = indices.length - 1; i >= 0; i--) {
                    liveLayerIds.move(
                        indices[i],
                        arr.length - indices.length - i - 2
                    );
                }
            },
            [selection]
        );

        const sendToBack = useMutation(
            ({ storage }) => {
                const liveLayerIds = storage.get('layerIds');
                const indices: number[] = [];
                const arr = liveLayerIds.toImmutable();
                arr.forEach((id, ind) => {
                    const index = selection.includes(id);
                    if (index) {
                        indices.push(ind);
                    }
                });
                indices.forEach((index, i) => {
                    liveLayerIds.move(index, i);
                });
            },
            [selection]
        );

        const fillColor = useMutation(
            ({ storage }, color: Color) => {
                const liveLayers = storage.get('layers');
                setLastusedColor(color);
                selection.forEach((id) => {
                    liveLayers.get(id)?.set('color', color);
                });
            },
            [selection, setLastusedColor]
        );

        const selectionBounds = useSelectionBounds();
        if (!selectionBounds) {
            return null;
        }

        const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
        const y = selectionBounds.y + camera.y;

        return (
            <div
                className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
                style={{
                    transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%)`,
                }}
            >
                <Colors onChange={fillColor} />
                <div className="flex items-center pl-2 ml-2">
                    <Hint label="Bring to Front" side="top" sideOffset={10}>
                        <Button
                            variant="board"
                            size="icon"
                            onClick={bringToFront}
                        >
                            <BringToFront />
                        </Button>
                    </Hint>
                </div>
                <div className="flex items-center pl-2 ml-2">
                    <Hint label="Send to back" side="top" sideOffset={10}>
                        <Button
                            variant="board"
                            size="icon"
                            onClick={sendToBack}
                        >
                            <SendToBack />
                        </Button>
                    </Hint>
                </div>
                <div className="flex items-center pl-2 ml-2">
                    <Hint label="Delete Layer" side="top" sideOffset={10}>
                        <Button
                            variant="board"
                            size="icon"
                            onClick={deleteLayer}
                        >
                            <Trash2 />
                        </Button>
                    </Hint>
                </div>
            </div>
        );
    }
);

SelectionTools.displayName = 'SelectionTools';
