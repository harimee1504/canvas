import { EmptyOrganizationState } from '../_components/layout/org_sidebar/empty-organization-state';
import { BoardList } from '../_components/board/board-list';

interface CanvasMainProps {
    // eslint-disable-next-line
    organization: any;
    query: {
        search: string | undefined;
        favorites: string | undefined;
    };
}

const CanvasMainComponent = ({ organization, query }: CanvasMainProps) => {
    return (
        <main className="flex-1 h-[100%-80px] p-6">
            {!organization ? (
                <EmptyOrganizationState />
            ) : (
                <BoardList orgId={organization.id} query={query} />
            )}
        </main>
    );
};

export default CanvasMainComponent;
