import { CreateOrganizationButton } from './create-organization';
import { OrganizationList } from './org-list';
import { ManageOrganizationButton } from './manage-organization';

export const OrgSidebar = () => {
    return (
        <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white justify-between">
            <div className="flex flex-col gap-y-4">
                <OrganizationList />
                <CreateOrganizationButton />
            </div>
            <ManageOrganizationButton />
        </aside>
    );
};

export default OrgSidebar;
