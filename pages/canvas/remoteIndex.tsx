import Canvas from './[[...index]]';

import { useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/providers/modal-providers';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

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
