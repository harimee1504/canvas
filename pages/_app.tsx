'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import type { AppProps } from 'next/app';
import { ConvexReactClient } from 'convex/react';
import { ModalProvider } from '@/providers/modal-providers';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

interface WrapperProps {
    children: React.ReactNode;
    data: {
        navMain: {
            title: string;
            url: string;
            icon: string;
            isActive: boolean;
            items: {
                title: string;
                args?: {};
                icon: string;
                url: () => void;
            }[];
        }[];
    };
}

const Wrapper = dynamic<WrapperProps>(() => import('auth/wrapper'!), {
    ssr: false,
});

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const { isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    return (
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            {children}
        </ConvexProviderWithClerk>
    );
}

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const data = {
        navMain: [
            {
                title: 'Canvas',
                url: '#',
                icon: 'FileBox',
                isActive: true,
                items: [
                    {
                        title: 'Canvas',
                        args: {},
                        icon: 'FileBox',
                        url: () => {
                            router.replace("/canvas");
                        },
                    },
                    {
                        title: 'Favourites',
                        icon: 'FolderHeart',
                        url: () => {
                            router.push({
                                query: { favorites: true },
                            });
                        },
                    }
                ],
            },
        ],
    };
    return (
        <ClerkProvider
            publishableKey={
                process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string
            }
        >
            <ConvexClientProvider>
            <link rel="stylesheet" href="https://auth-layout.vercel.app/_next/static/chunks/pages/_app.css" />
                <Wrapper data={data}>
                    <Toaster />
                    <ModalProvider />
                    <Component {...pageProps} />
                </Wrapper>
            </ConvexClientProvider>
        </ClerkProvider>
    );
}
