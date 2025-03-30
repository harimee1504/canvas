import Canvas from './[[...index]]';

import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/providers/modal-providers';


const RemoteIndex = () => {
    return (
        <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            <Canvas />
        </ConvexClientProvider>
    );
};

export default RemoteIndex;
