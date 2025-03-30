import { Skeleton } from '@/components/ui/skeleton';
import { ToolButton } from './tool-button';
import {
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from 'lucide-react';
import { CanvasMode, CanvasState, ShapeType } from '@/types/canvas';

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
}: ToolbarProps) => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    icon={MousePointer2}
                    label="Select"
                    onClick={() => setCanvasState({ mode: CanvasMode.Default })}
                    isActive={
                        canvasState.mode === CanvasMode.Default ||
                        canvasState.mode === CanvasMode.Selection ||
                        canvasState.mode === CanvasMode.Dragging ||
                        canvasState.mode === CanvasMode.Resizing ||
                        canvasState.mode === CanvasMode.Pressing
                    }
                />
                <ToolButton
                    icon={Type}
                    label="Text"
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            shapeType: ShapeType.Text,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.shapeType === ShapeType.Text
                    }
                />
                <ToolButton
                    icon={StickyNote}
                    label="Sticky Note"
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            shapeType: ShapeType.StickyNote,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.shapeType === ShapeType.StickyNote
                    }
                />
                <ToolButton
                    icon={Square}
                    label="Rectangle"
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            shapeType: ShapeType.Rectangle,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.shapeType === ShapeType.Rectangle
                    }
                />
                <ToolButton
                    icon={Circle}
                    label="Ellipse"
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            shapeType: ShapeType.Ellipse,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.shapeType === ShapeType.Ellipse
                    }
                />
                <ToolButton
                    icon={Pencil}
                    label="Pen"
                    onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    icon={Undo2}
                    label="Undo"
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    icon={Redo2}
                    label="Redo"
                    onClick={redo}
                    isDisabled={!canRedo}
                />
            </div>
        </div>
    );
};

export default Toolbar;

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 w-[60px] h-[360px]">
            <Skeleton className="w-fuill h-full bg-white shadow-md " />
            <Skeleton className="bg-white shadow-md w-full h-[100px]" />
        </div>
    );
};
