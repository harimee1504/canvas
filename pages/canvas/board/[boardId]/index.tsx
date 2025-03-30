import { useRouter } from 'next/router';
import { Canvas } from './_components/canvas';
import { Room } from '@/components/room';
import { CanvasLoading } from './_components/loading';

const Board = () => {
    const router = useRouter();
    const { boardId } = router.query;
    if (!boardId) {
        return <div>Fetching Board Loading...</div>;
    }
    return (
        <Room id={boardId as string} fallback={<CanvasLoading />}>
            <Canvas boardId={boardId as string} />
        </Room>
    );
};

export default Board;
