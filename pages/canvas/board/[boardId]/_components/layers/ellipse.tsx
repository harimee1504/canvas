import { colorToHex } from '@/lib/utils';
import { Ellipse } from '@/types/canvas';

interface EllipseProps {
    id: string;
    layer: Ellipse;
    onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const EllipseLayerPreview = ({
    id,
    layer,
    onLayerPointerDown,
    selectionColor,
}: EllipseProps) => {
    const { x, y, width, height, color } = layer;
    return (
        <ellipse
            className="drop-shadow-md"
            id={id}
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            fill={color ? colorToHex(color) : '#000'}
            stroke={selectionColor || 'transparent'}
            strokeWidth={1}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
        />
    );
};
