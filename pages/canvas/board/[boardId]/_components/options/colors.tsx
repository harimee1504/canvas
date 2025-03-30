'use client';

import { colorToHex } from '@/lib/utils';
import { Color } from '@/types/canvas';
import { Pipette } from 'lucide-react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';

interface ColorsProps {
    onChange: (color: Color) => void;
}

export const Colors = ({ onChange }: ColorsProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[250px] pr-2 mr-2">
            <ColorButton
                onClick={onChange}
                color={{ r: 243, g: 82, b: 35, a: 1 }}
            />
            <ColorButton
                onClick={onChange}
                color={{ r: 255, g: 249, b: 177, a: 1 }}
            />
            <ColorButton
                onClick={onChange}
                color={{ r: 39, g: 142, b: 237, a: 1 }}
            />
            <ColorButton
                onClick={onChange}
                color={{ r: 155, g: 105, b: 245, a: 1 }}
            />
            <ColorButton
                onClick={onChange}
                color={{ r: 255, g: 255, b: 255, a: 1 }}
            />
            <ColorPickerButton
                onClick={onChange}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                initColor="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500"
            />
        </div>
    );
};

interface ColorOptionProps {
    onClick: (color: Color) => void;
    color: Color;
    initColor?: string;
}

const ColorButton = ({ onClick, color }: ColorOptionProps) => {
    return (
        <button
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-neutral-300"
            style={{ background: colorToHex(color) }}
            onClick={() => onClick(color)}
        ></button>
    );
};

const ColorPickerButton = ({ onClick, color }: ColorOptionProps) => {
    const [open, setOpen] = useState(false);
    const [newColor, setNewColor] = useState(color);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeComplete = (color: any) => {
        setNewColor(color.rgb);
        onClick(color.rgb);
    };
    return (
        <button
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-neutral-300"
            onClick={() => setOpen((prevState) => !prevState)}
        >
            <Pipette className="w-5 h-5" />
            {open && (
                <div>
                    <ChromePicker
                        color={newColor}
                        onChangeComplete={handleChangeComplete}
                    />
                </div>
            )}
        </button>
    );
};

export default Colors;