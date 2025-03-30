import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Hint } from './hint';

interface UserAvatarProps {
    name: string;
    picture: string;
    fallback?: string;
    outlineColor?: string;
}

export const UserAvatar = ({
    name,
    picture,
    fallback,
    outlineColor,
}: UserAvatarProps) => {
    return (
        <Hint label={name} sideOffset={10}>
            <Avatar
                className="w-10 h-10 border-2"
                style={{ borderColor: outlineColor }}
            >
                <AvatarImage src={picture} alt={name} />
                <AvatarFallback className="text-xs font-semibold">
                    {fallback}
                </AvatarFallback>
            </Avatar>
        </Hint>
    );
};
