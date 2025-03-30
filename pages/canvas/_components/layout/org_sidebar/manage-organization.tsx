'use client';

import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Hint } from '@/components/hint';
import { OrganizationProfile } from '@clerk/clerk-react';

export const ManageOrganizationButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint
                        label="Organization settings"
                        side="right"
                        align="start"
                        sideOffset={14}
                    >
                        <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
                            <Settings className="text-white" />
                        </button>
                    </Hint>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[300px]">
                <OrganizationProfile />
            </DialogContent>
        </Dialog>
    );
};
