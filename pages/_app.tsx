import '@/styles/globals.css';
import 'dynamic-import-polyfill';
import type { AppProps } from 'next/app';

import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/providers/modal-providers';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            <Component {...pageProps} />
        </ConvexClientProvider>
    );
}
