'use client';

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { StickyNote } from '@/types/canvas';
import { colorToHex, getContrastColor } from '@/lib/utils';
import { useMutation } from '@liveblocks/react/suspense';

interface NoteLayerProps {
    id: string;
    layer: StickyNote;
    onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

const calcFontSize = (width: number, height: number) => {
    const maxSize = 96;
    const scale = 0.15;
    const fontHeight = height * scale;
    const fontWidth = width * scale;
    const fontSize = Math.min(fontHeight, fontWidth, maxSize);
    return fontSize;
};

export const StickyNoteLayerPreview = ({
    id,
    layer,
    onLayerPointerDown,
    selectionColor,
}: NoteLayerProps) => {
    const { x, y, width, height, color, value } = layer;

    const updateValue = useMutation(({ storage }, newValue: string) => {
        const liveLayers = storage.get('layers');
        liveLayers.get(id)?.set('value', newValue);
    }, []);

    const handleChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value);
    };

    return (
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
                outline: selectionColor
                    ? `1px solid ${selectionColor}`
                    : `none`,
                backgroundColor: color ? colorToHex(color) : '#FEFF9C',
            }}
            className="shadow-md drop-shadow-xl"
            onPointerDown={(e) => onLayerPointerDown(e, id)}
        >
            <ContentEditable
                html={value || 'Text'}
                className={
                    'w-full h-full flex items-center justify-center text-center outline-none font-kalam '
                }
                style={{
                    fontSize: calcFontSize(width, height),
                    color: color ? getContrastColor(color) : '#000',
                }}
                onChange={handleChange}
            />
        </foreignObject>
    );
};
