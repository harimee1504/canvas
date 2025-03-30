'use client';

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { Text } from '@/types/canvas';
import { colorToHex } from '@/lib/utils';
import { useMutation } from '@liveblocks/react/suspense';

interface TextLayerProps {
    id: string;
    layer: Text;
    onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

const calcFontSize = (width: number, height: number) => {
    const maxSize = 96;
    const scale = 0.5;
    const fontHeight = height * scale;
    const fontWidth = width * scale;
    const fontSize = Math.min(fontHeight, fontWidth, maxSize);
    return fontSize;
};

export const TextLayerPreview = ({
    id,
    layer,
    onLayerPointerDown,
    selectionColor,
}: TextLayerProps) => {
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
            }}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
        >
            <ContentEditable
                html={value || 'Text'}
                className={
                    'w-full h-full flex items-center justify-center text-center drop-shadow-md outline-none font-kalam'
                }
                style={{
                    fontSize: calcFontSize(width, height),
                    color: color ? colorToHex(color) : '#000',
                }}
                onChange={handleChange}
            />
        </foreignObject>
    );
};

export default TextLayerPreview;