'use client';
import qs from 'query-string';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';
export const SearchInput = () => {
    const router = useRouter();
    const handleSearch = (value: string) => {
        const url = qs.stringifyUrl(
            {
                url: '/canvas',
                query: {
                    search: value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    };

    const debouncedSearch = useCallback(
        debounce((value: string) => handleSearch(value), 500),
        [handleSearch]
    );

    return (
        <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                className="w-full max-w-[560px] pl-9"
                placeholder="Seach Boards"
                onChange={(e) => debouncedSearch(e.target.value)}
            />
        </div>
    );
};
