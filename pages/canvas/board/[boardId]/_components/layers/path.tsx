import { getSvgPathFromStroke } from '@/lib/utils';
import getStroke from 'perfect-freehand';

interface PathLayerPreviewProps {
    x: number;
    y: number;
    points: number[][];
    fill: string;
    onPointerDown: (e: React.PointerEvent) => void;
    stroke?: string;
}

export const Path = ({
    x,
    y,
    points,
    fill,
    onPointerDown,
    stroke,
}: PathLayerPreviewProps) => {
    console.log('Path Component called');
    const path = getSvgPathFromStroke(
        getStroke(points, {
            size: 16,
            thinning: 0.5,
            streamline: 0.5,
            smoothing: 0.5,
        })
    );
    console.log('Points to path', path);
    return (
        <path
            className="drop-shadow-md"
            onPointerDown={onPointerDown}
            d={path}
            fill={fill}
            stroke={stroke}
            x={0}
            y={0}
            style={{ transform: `translate(${x},${y})` }}
            strokeWidth={1}
        />
    );
};

export default Path;