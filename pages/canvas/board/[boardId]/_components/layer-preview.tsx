'use client';
import { ShapeType } from '@/types/canvas';
import { useStorage } from '@liveblocks/react/suspense';
import { memo } from 'react';
import { RectangleLayerPreview } from './layers/rectangle';
import { EllipseLayerPreview } from './layers/ellipse';
import { TextLayerPreview } from './layers/text';
import { StickyNoteLayerPreview } from './layers/sticky-notes';
import { Path } from './layers/path';
import { colorToHex } from '@/lib/utils';

interface LayerProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor: string;
}
export const LayerPreview = memo(
    ({ id, onLayerPointerDown, selectionColor }: LayerProps) => {
        const layer = useStorage((root) => root.layers.get(id));
        if (!layer) return null;

        switch (layer.type) {
            case ShapeType.Rectangle:
                return (
                    <RectangleLayerPreview
                        id={id}
                        layer={layer}
                        onLayerPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case ShapeType.Ellipse:
                return (
                    <EllipseLayerPreview
                        id={id}
                        layer={layer}
                        onLayerPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case ShapeType.Text:
                return (
                    <TextLayerPreview
                        id={id}
                        layer={layer}
                        onLayerPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case ShapeType.StickyNote:
                return (
                    <StickyNoteLayerPreview
                        id={id}
                        layer={layer}
                        onLayerPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case ShapeType.Path:
                console.log('Path layer called');
                return (
                    <Path
                        key={id}
                        x={layer.x}
                        y={layer.y}
                        fill={layer.color ? colorToHex(layer.color) : '#000'}
                        points={layer.coordinates}
                        onPointerDown={(e) => onLayerPointerDown(e, id)}
                        stroke={selectionColor}
                    />
                );
            default:
                console.warn('Unknown layer type');
                return null;
        }
    }
);

LayerPreview.displayName = 'LayerPreview';

export default LayerPreview;
