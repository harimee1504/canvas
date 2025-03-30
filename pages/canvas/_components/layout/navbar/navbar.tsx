'use client';

import { UserButton } from '@clerk/clerk-react';
import { InviteButton } from './invite-button';
import { SearchInput } from './search-input';

export const Navbar = () => {
    return (
        <div className="flex items-center gap-x-4 p-5">
            <div className="hidden lg:flex lg:flex-1">
                <SearchInput />
            </div>
            <div className="block lg:hidden flex-1"></div>
            <InviteButton />
            <div className="flex">
                <UserButton />
            </div>
        </div>
    );
};
