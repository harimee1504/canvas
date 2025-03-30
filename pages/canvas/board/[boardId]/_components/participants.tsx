import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { getColor } from '@/lib/utils';
import { useOthers, useSelf } from '@liveblocks/react/suspense';

const MAX_OTHER_USERS = 2;

export const Participants = () => {
    const others = useOthers();
    const me = useSelf();
    const userCount = others.length;
    const hasMore = userCount > MAX_OTHER_USERS;
    return (
        <div className="absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md">
            <div className="flex gap-x-2">
                <UserAvatar
                    name={`${me?.info.name} (You)`}
                    picture={me?.info.picture}
                    fallback={me?.info.name[0]}
                    outlineColor={getColor(me?.id)}
                />
                {others.slice(0, MAX_OTHER_USERS).map(({ id, info }) => (
                    <UserAvatar
                        key={id}
                        name={info.name}
                        picture={info.picture}
                        fallback={info.name[0] || '-'}
                        outlineColor={getColor(id)}
                    />
                ))}
                {hasMore && (
                    <UserAvatar
                        name={`+${userCount - MAX_OTHER_USERS} More`}
                        picture=""
                        fallback={`+${userCount - MAX_OTHER_USERS}`}
                    />
                )}
            </div>
        </div>
    );
};

export default Participants;

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md animate-pulse w-[200px]">
            <Skeleton className="w-fuill h-full bg-muted-foreground" />
        </div>
    );
};
