import Image from 'next/image';
import { CreateBoard } from './create-board';

export const EmptyBoards = () => {
    return (
        <div className="h-full flex items-center justify-center flex-col">
            <Image
                src="/empty-search.png"
                height={140}
                width={140}
                alt="No boards found"
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first board!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <CreateBoard />
            </div>
        </div>
    );
};
