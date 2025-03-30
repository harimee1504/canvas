import { colorToHex } from '@/lib/utils';
import { Rectangle } from '@/types/canvas';

interface RectangleProps {
    id: string;
    layer: Rectangle;
    onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const RectangleLayerPreview = ({
    id,
    layer,
    onLayerPointerDown,
    selectionColor,
}: RectangleProps) => {
    const { x, y, width, height, color } = layer;
    return (
        <rect
            className="drop-shadow-md"
            id={id}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color ? colorToHex(color) : '#000'}
            stroke={selectionColor || 'transparent'}
            strokeWidth={selectionColor ? 2 : 0}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
        />
    );
};

export default RectangleLayerPreview;