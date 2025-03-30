import { useMutation, useSelf } from '@liveblocks/react/suspense';

export const useDeleteLayer = () => {
    const selection = useSelf((me) => me.presence.selection);
    return useMutation(
        ({ storage, setMyPresence }) => {
            const livelayers = storage.get('layers');
            const livelayerids = storage.get('layerIds');

            selection.forEach((id) => {
                livelayers.delete(id);
                const index = livelayerids.indexOf(id);
                if (index > -1) {
                    livelayerids.delete(index);
                }
            });
            setMyPresence({ selection: [] }, { addToHistory: true });
        },
        [selection]
    );
};
