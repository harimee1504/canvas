'use client';

import Image from 'next/image';
import { useOrganization } from '@clerk/clerk-react';
import { Hint } from '@/components/hint';

import CanvasSidebar from '../canvas-sidebar';

export const AppSidebar = () => {
    const { organization } = useOrganization();
    return (
        <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <div className="flex items-center gap-x-4">
                <Image
                    src={organization?.imageUrl || ''}
                    alt={organization?.name || 'No Organization'}
                    width={30}
                    height={30}
                    className="rounded-md cursor-pointer"
                />
                <Hint
                    label={organization?.name || 'No Organization'}
                    align="end"
                    side="bottom"
                    sideOffset={9}
                    alignOffset={-5}
                >
                    <span className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
                        {organization?.name || 'No Organization'}
                    </span>
                </Hint>
            </div>
            <CanvasSidebar />
        </div>
    );
};
