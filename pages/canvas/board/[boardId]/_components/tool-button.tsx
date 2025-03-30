'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';

interface ToolButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
}

export const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    isActive = false,
    isDisabled = false,
}: ToolButtonProps) => {
    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button
                variant={isActive ? 'boardActive' : 'board'}
                // className="w-8 h-8 p-0"
                onClick={onClick}
                disabled={isDisabled}
            >
                <Icon className="h-4 w-4" />
            </Button>
        </Hint>
    );
};
