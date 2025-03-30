import Image from 'next/image';

export const EmptySearch = () => {
    return (
        <div className="h-full flex items-center justify-center flex-col">
            <Image
                src="/empty-search.png"
                height={140}
                width={140}
                alt="No Search Results"
            />
            <h2 className="text-2xl font-semibold mt-6">No results found!</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try searching different keywords
            </p>
        </div>
    );
};

export default EmptySearch;