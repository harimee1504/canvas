'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import {
    Camera,
    CanvasMode,
    CanvasState,
    Color,
    Point,
    ShapeType,
    Side,
    XYWH,
} from '@/types/canvas';
import {
    useCanRedo,
    useCanUndo,
    useHistory,
    useMutation,
    useOthersMapped,
    useSelf,
    useStorage,
} from '@liveblocks/react/suspense';
import {
    colorToHex,
    findIntersectingLayers,
    getColor,
    pointerEventToCanvasPoint,
    pointsToPath,
    resizaBounds,
} from '@/lib/utils';
import { CursorPresence } from './cursors/cursors-presence';
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layer-preview';
import { SelectionBox } from './selection-box';
import { SelectionTools } from './selection-tools';
import { Path } from './layers/path';
import { useDisableScrollBounce } from '@/hooks/use-disable-scroll-bounce';
import { useDeleteLayer } from '@/hooks/use-delete-layer';

const MAX_LAYERS = 50;

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [lastusedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    });
    const layerIds = useStorage((root) => root.layerIds);
    const [canvasSate, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.Default,
    });
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();
    const deleteLayer = useDeleteLayer();
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Backspace') {
                // deleteLayer();
            } else if (e.key === 'z') {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        history.redo();
                    } else {
                        history.undo();
                    }
                }
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [deleteLayer, history]);

    useDisableScrollBounce();
    const InsertLayer = useMutation(
        (
            { storage, setMyPresence },
            layerType:
                | ShapeType.Ellipse
                | ShapeType.Rectangle
                | ShapeType.Text
                | ShapeType.StickyNote,
            position: Point
        ) => {
            const liveLayers = storage.get('layers');
            if (liveLayers.size >= MAX_LAYERS) {
                return;
            }
            const liveLayerIds = storage.get('layerIds');

            const layerId = nanoid();
            const layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                width: 100,
                height: 100,
                color: lastusedColor,
            });
            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer);
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            setCanvasState({ mode: CanvasMode.Default });
        },
        [lastusedColor]
    );

    const onResize = useCallback(
        (side: Side, init: XYWH) => {
            history.pause();
            setCanvasState({
                mode: CanvasMode.Resizing,
                initial: init,
                side: side,
            });
        },
        [history]
    );

    const updateSelection = useMutation(
        ({ storage, setMyPresence }, current: Point, origin: Point) => {
            const liveLayers = storage.get('layers').toImmutable();
            setCanvasState({ mode: CanvasMode.Selection, origin, current });
            const ids = findIntersectingLayers(
                layerIds,
                liveLayers,
                origin,
                current
            );
            setMyPresence({ selection: ids });
            // setMyPresence({ selection: ids }, { addToHistory: true });
        },
        [layerIds]
    );

    const startSelection = useCallback((current: Point, origin: Point) => {
        if (
            Math.abs(current.x - origin.x) < 5 &&
            Math.abs(current.y - origin.y) < 5
        ) {
            setCanvasState({ mode: CanvasMode.Selection, origin, current });
        }
    }, []);

    const startDrawing = useMutation(
        ({ setMyPresence }, point: Point, pressure: number) => {
            console.log('started drawing', point, pressure);
            setMyPresence({
                pencilDraft: [[point.x, point.y, pressure]],
                penColor: lastusedColor,
            });
        },
        []
    );

    const continueDrawing = useMutation(
        ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
            const { pencilDraft } = self.presence;
            if (
                canvasSate.mode !== CanvasMode.Pencil ||
                e.buttons !== 1 ||
                pencilDraft == null
            ) {
                return;
            }
            console.log(
                'continue drawing received props after validation',
                pencilDraft,
                point,
                e.pressure
            );
            setMyPresence({
                cursor: point,
                pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
            });
        },
        [canvasSate.mode]
    );

    const insertPath = useMutation(
        ({ self, storage, setMyPresence }) => {
            const liveLayers = storage.get('layers');
            const { pencilDraft } = self.presence;
            if (
                pencilDraft == null ||
                pencilDraft.length < 2 ||
                liveLayers.size >= MAX_LAYERS
            ) {
                return;
            }
            const id = nanoid();
            liveLayers.set(
                id,
                new LiveObject(pointsToPath(pencilDraft, lastusedColor))
            );
            const liveLayerIds = storage.get('layerIds');
            liveLayerIds.push(id);
            setMyPresence({ pencilDraft: null });
            setCanvasState({ mode: CanvasMode.Pencil });
        },
        [lastusedColor]
    );

    const resizeShape = useMutation(
        ({ storage, self }, point: Point, state: CanvasState) => {
            if (state.mode !== CanvasMode.Resizing) {
                return;
            }
            const bounds = resizaBounds(state.initial, state.side, point);
            const liveLayers = storage.get('layers');
            const livelayer = liveLayers.get(self.presence.selection[0]);
            if (livelayer) {
                livelayer.update(bounds);
            }
        },
        []
    );

    const unSelectLayer = useMutation(({ setMyPresence, self }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const dragSelectedLayers = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasSate.mode !== CanvasMode.Dragging) {
                return;
            }
            const offSet = {
                x: point.x - canvasSate.current.x,
                y: point.y - canvasSate.current.y,
            };
            const liveLayers = storage.get('layers');
            for (const id of self.presence.selection) {
                const layer = liveLayers.get(id);
                if (layer) {
                    layer.update({
                        x: layer.get('x') + offSet.x,
                        y: layer.get('y') + offSet.y,
                    });
                }
            }
            setCanvasState({ mode: CanvasMode.Dragging, current: point });
        },
        [canvasSate]
    );

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((c) => ({
            x: c.x - e.deltaY,
            y: c.y + e.deltaX,
        }));
    }, []);

    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault();
            const current = pointerEventToCanvasPoint(e, camera);
            if (canvasSate.mode === CanvasMode.Pressing) {
                startSelection(current, canvasSate.origin);
            } else if (canvasSate.mode === CanvasMode.Selection) {
                updateSelection(current, canvasSate.origin);
            } else if (canvasSate.mode === CanvasMode.Dragging) {
                dragSelectedLayers(current);
            } else if (canvasSate.mode === CanvasMode.Resizing) {
                resizeShape(current, canvasSate);
            } else if (canvasSate.mode === CanvasMode.Pencil) {
                continueDrawing(current, e);
            }
            setMyPresence({ cursor: current });
        },
        [
            camera,
            canvasSate,
            resizeShape,
            dragSelectedLayers,
            continueDrawing,
            startSelection,
            updateSelection,
            startDrawing,
        ]
    );

    const onPointerUp = useMutation(
        ({}, e) => {
            const point = pointerEventToCanvasPoint(e, camera);
            if (
                canvasSate.mode === CanvasMode.Default ||
                canvasSate.mode === CanvasMode.Pressing
            ) {
                unSelectLayer();
                setCanvasState({ mode: CanvasMode.Default });
            } else if (canvasSate.mode === CanvasMode.Pencil) {
                insertPath();
            } else if (canvasSate.mode === CanvasMode.Inserting) {
                InsertLayer(canvasSate.shapeType, point);
            } else {
                setCanvasState({ mode: CanvasMode.Default });
            }
            history.resume();
        },
        [
            camera,
            canvasSate,
            history,
            InsertLayer,
            setCanvasState,
            insertPath,
            unSelectLayer,
        ]
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            const point = pointerEventToCanvasPoint(e, camera);
            if (canvasSate.mode === CanvasMode.Inserting) {
                return;
            }
            if (canvasSate.mode === CanvasMode.Pencil) {
                console.log('On Pointer Down', point, e.pressure);
                startDrawing(point, e.pressure);
            }
            setCanvasState({ mode: CanvasMode.Pressing, origin: point });
        },
        [camera, canvasSate.mode, setCanvasState, startDrawing]
    );

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
            if (
                canvasSate.mode === CanvasMode.Pencil ||
                canvasSate.mode === CanvasMode.Inserting
            ) {
                return;
            }
            history.pause();
            e.stopPropagation();
            const point = pointerEventToCanvasPoint(e, camera);
            if (!self.presence?.selection.includes(layerId)) {
                setMyPresence({ selection: [layerId] }, { addToHistory: true });
            }
            setCanvasState({ mode: CanvasMode.Dragging, current: point });
        },
        [setCanvasState, camera, history, canvasSate.mode]
    );

    const selections = useOthersMapped((other) => {
        return {
            selection: other.presence?.selection,
            id: other.id,
        };
    });

    const layerIdsToColor = useMemo(() => {
        const layerIdsToColor: Record<string, string> = {}; // Explicitly type the object

        for (const user of selections) {
            const [, { id, selection }] = user;
            for (const layerId of selection) {
                layerIdsToColor[layerId] = getColor(id); // layerId is the key, and getColor returns a string
            }
        }
        return layerIdsToColor;
    }, [selections]);

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasSate}
                setCanvasState={setCanvasState}
                undo={history.undo}
                redo={history.redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <SelectionTools
                camera={camera}
                setLastusedColor={setLastUsedColor}
            />
            <svg
                className="h-[100vh] w-full cursor-pointer"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColor[layerId]}
                        />
                    ))}

                    <SelectionBox onResize={onResize} />
                    {canvasSate.mode === CanvasMode.Selection &&
                        canvasSate.current != null && (
                            <rect
                                className="fill-purple-500/5 stroke-purple-500 stroke-1 pointer-events-none"
                                x={Math.min(
                                    canvasSate.origin.x,
                                    canvasSate.current.x
                                )}
                                y={Math.min(
                                    canvasSate.origin.y,
                                    canvasSate.current.y
                                )}
                                width={Math.abs(
                                    canvasSate.origin.x - canvasSate.current.x
                                )}
                                height={Math.abs(
                                    canvasSate.origin.y - canvasSate.current.y
                                )}
                            />
                        )}
                    <CursorPresence />
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            points={pencilDraft}
                            x={0}
                            y={0}
                            fill={colorToHex(lastusedColor)}
                            stroke="black"
                            onPointerDown={onPointerDown}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
};
