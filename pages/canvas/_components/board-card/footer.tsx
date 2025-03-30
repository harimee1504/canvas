import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { useOrganization } from '@clerk/clerk-react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface FooterProps {
    isFavorite: boolean;
    title: string;
    authorLabel: string;
    createdAtLabel: string;
    disabled?: boolean;
    onClick?: () => void;
    boardId?: string;
    hovering: boolean;
}
export const Footer = ({
    isFavorite,
    title,
    authorLabel,
    createdAtLabel,
    disabled,
    boardId,
    hovering,
}: FooterProps) => {
    const { mutate: favoriteBoard, loading: loadingFavorite } = useApiMutation(
        api.board.favoriteBoard
    );
    const { mutate: unfavoriteBoard, loading: loadingUnfavorite } =
        useApiMutation(api.board.unfavoriteBoard);
    const { organization } = useOrganization();
    const handleFavorite = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!organization) return;
        if (isFavorite) {
            unfavoriteBoard({ boardId: boardId, orgId: organization.id })
                .then(() => {
                    toast.success('Board unfavorited successfully');
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('Failed to unfavorite board');
                });
        } else {
            favoriteBoard({ boardId: boardId, orgId: organization.id })
                .then(() => {
                    toast.success('Board favorited successfully');
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('Failed to favorite board');
                });
        }
    };
    return (
        <div className="relative bg-white p-3">
            <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
                {title}
            </p>
            {hovering && (
                <>
                    <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
                        {authorLabel}
                        <br /> {createdAtLabel}
                    </p>
                    <button
                        disabled={
                            disabled || loadingFavorite || loadingUnfavorite
                        }
                        onClick={handleFavorite}
                        className={cn(
                            'absolute right-3 top-3 opacity-0 group-hover:opacity-100 hover:text-blue-600 text-muted-foreground',
                            disabled || loadingFavorite || loadingUnfavorite
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer'
                        )}
                    >
                        <Star
                            className={cn(
                                'w-4 h-4',
                                isFavorite
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted-foreground'
                            )}
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default Footer;