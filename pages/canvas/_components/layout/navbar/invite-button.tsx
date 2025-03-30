'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { OrganizationProfile, useOrganization } from '@clerk/clerk-react';
import { Plus } from 'lucide-react';

export const InviteButton = () => {
    const { organization } = useOrganization();
    if (!organization) return null;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite members
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[300px]">
                <OrganizationProfile />
            </DialogContent>
        </Dialog>
    );
};

export default InviteButton;
