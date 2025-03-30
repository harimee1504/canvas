'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboard, Star } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CanvasSidebar = () => {
    const searchParams = useSearchParams();
    const favorites = searchParams?.get('favorites');
    return (
        <div className="w-full space-y-1">
            <Button
                asChild
                size="lg"
                variant={favorites ? 'ghost' : 'activeSecondary'}
                className="font-normal justify-start px-2 w-full"
            >
                <Link
                    href={{
                        pathname: '/canvas',
                    }}
                >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Team Boards
                </Link>
            </Button>
            <Button
                asChild
                size="lg"
                variant={favorites ? 'activeSecondary' : 'ghost'}
                className="font-normal justify-start px-2 w-full"
            >
                <Link
                    href={{
                        pathname: '/canvas',
                        query: {
                            favorites: 'true',
                        },
                    }}
                >
                    <Star className="h-4 w-4 mr-2" />
                    Favorite Boards
                </Link>
            </Button>
        </div>
    );
};

export default CanvasSidebar;
