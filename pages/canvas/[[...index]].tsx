'use client';

import { useOrganization } from '@clerk/nextjs';
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
        <Layout>
            <CanvasMainComponent organization={organization} query={query} />
        </Layout>
    );
};

export default Canvas;
