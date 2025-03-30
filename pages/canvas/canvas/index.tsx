'use client';

import CanvasMainComponent from './mainComponent';
import { useOrganization } from '@clerk/clerk-react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const { organization } = useOrganization();
    const searchParams = useSearchParams();
    const query = {
        search: searchParams.get('search') ?? undefined,
        favorites: searchParams.get('favorites') ?? undefined,
    };
    return <CanvasMainComponent organization={organization} query={query} />;
};

export default Page;
