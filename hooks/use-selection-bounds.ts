import { Layer, XYWH } from '@/types/canvas';
import { shallow } from '@liveblocks/client';
import { useSelf, useStorage } from '@liveblocks/react/suspense';

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    if (!first) {
        return null;
    }
    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;
    for (const layer of layers) {
        const { x, y, width, height } = layer;
        if (x < left) left = x;
        if (x + width > right) right = x + width;
        if (y < top) top = y;
        if (y + height > bottom) bottom = y + height;
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);
    return useStorage((root) => {
        const selectionLayers = selection
            .map((id) => root.layers.get(id)!)
            .filter(Boolean);
        return boundingBox(selectionLayers);
    }, shallow);
};
