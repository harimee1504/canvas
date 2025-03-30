import crypto from 'crypto';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    Camera,
    Color,
    Layer,
    Path,
    Point,
    ShapeType,
    Side,
    XYWH,
} from '@/types/canvas';

const COLORS = [
    '#FF5733',
    '#33FF57',
    '#339BFF',
    '#F1C40F',
    '#9B59B6',
    '#FFA500',
    '#FF69B4',
    '#00FFFF',
    '#A4D65E',
    '#FF7F50',
];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const hash = (input: string) => {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return BigInt('0x' + hash) % BigInt(1e10);
};

export const getColor = (id: string): string =>
    COLORS[Number(hash(id) % BigInt(COLORS.length))];

export const pointerEventToCanvasPoint = (
    e: React.PointerEvent,
    camera: Camera
) => {
    return {
        x: e.clientX - camera.x,
        y: e.clientY - camera.y,
    };
};

export const colorToHex = (color: Color) => {
    if (!color) return '#000';
    const { r, g, b, a } = color;
    return `#${[r, g, b, Math.round(a * 255)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
};

export const resizaBounds = (
    bounds: XYWH,
    corner: Side,
    point: Point
): XYWH => {
    const result = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
    };
    if ((corner & Side.Left) === Side.Left) {
        result.x = Math.min(point.x, bounds.x + bounds.width);
        result.width = Math.abs(bounds.x + bounds.width - point.x);
    }
    if ((corner & Side.Right) === Side.Right) {
        result.x = Math.min(point.x, bounds.x);
        result.width = Math.abs(point.x - bounds.x);
    }
    if ((corner & Side.Top) === Side.Top) {
        result.y = Math.min(point.y, bounds.y + bounds.height);
        result.height = Math.abs(bounds.y + bounds.height - point.y);
    }
    if ((corner & Side.Bottom) === Side.Bottom) {
        result.y = Math.min(point.y, bounds.y);
        result.height = Math.abs(point.y - bounds.y);
    }
    return result;
};

export const findIntersectingLayers = (
    layerIds: readonly string[],
    layers: ReadonlyMap<string, Layer>,
    a: Point,
    b: Point
) => {
    const rectangle = {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(b.x - a.x),
        height: Math.abs(b.y - a.y),
    };
    const ids = [];
    for (const id of layerIds) {
        const layer = layers.get(id);
        if (!layer) continue;

        const { x, y, width, height } = layer;
        if (
            rectangle.x < x + width &&
            rectangle.x + rectangle.width > x &&
            rectangle.y < y + height &&
            rectangle.y + rectangle.height > y
        ) {
            ids.push(id);
        }
    }
    return ids;
};

export const getContrastColor = (color: Color) => {
    const { r, g, b } = color;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
};

export const pointsToPath = (points: number[][], color: Color): Path => {
    if (points.length < 2) {
        throw new Error('Points must have at least 2 points');
    }
    let left = Number.POSITIVE_INFINITY;
    let right = Number.NEGATIVE_INFINITY;
    let top = Number.POSITIVE_INFINITY;
    let bottom = Number.NEGATIVE_INFINITY;
    for (const [x, y] of points) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
    }
    return {
        type: ShapeType.Path,
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        color,
        coordinates: points.map(([x, y, pressure]) => [
            x - left,
            y - top,
            pressure,
        ]),
    };
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
    if (!stroke.length) return '';
    const d = stroke.reduce(
        (acc, [prevX, prevY], i, arr) => {
            const [x, y] = arr[(i + 1) % arr.length];
            acc.push(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );
    d.push('Z');
    return d.join(' ');
};
