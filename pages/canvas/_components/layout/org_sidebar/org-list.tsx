'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { Organization } from './organization';

export const OrganizationList = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });
    if (!userMemberships?.data?.length) return null;

    return (
        <ul className="space-y-4">
            {userMemberships.data?.map((member) => (
                <li key={member.organization.id}>
                    <Organization
                        key={member.organization.id}
                        id={member.organization.id}
                        name={member.organization.name}
                        imageUrl={member.organization.imageUrl}
                    />
                </li>
            ))}
        </ul>
    );
};
