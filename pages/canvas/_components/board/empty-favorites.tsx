import Image from 'next/image';

export const EmptyFavorites = () => {
    return (
        <div className="h-full flex items-center justify-center flex-col">
            <Image
                src="/empty-search.png"
                height={140}
                width={140}
                alt="No Favorite canvas"
            />
            <h2 className="text-2xl font-semibold mt-6">No favorites found</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoriting a board
            </p>
        </div>
    );
};

export default EmptyFavorites;