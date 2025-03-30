'use client';

import { useOrganization } from '@clerk/clerk-react';
import Layout from './_components/layout/layout';
import { useSearchParams } from 'next/navigation';
import CanvasMainComponent from './canvas/mainComponent';

const Canvas = () => {
    const { organization } = useOrganization();
    const searchParams = useSearchParams();

    const query = searchParams ? {
        search: searchParams.get('search') ?? undefined,
        favorites: searchParams.get('favorites') ?? undefined,
    } : {
        search: undefined,
        favorites: undefined,
    } ;
    return (
        <CanvasMainComponent organization={organization} query={query} />
    );
};

export default Canvas;
