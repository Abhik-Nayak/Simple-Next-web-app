'use client'
import React from 'react';
import clsx from 'clsx';


type Props = {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullWidth?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button = ({ type, fullWidth, children, onClick, secondary, danger, disabled }: Props) => {
    return (
        <button
            onClick={onClick} type={type}
            disabled={disabled}
            className={clsx(`flex 
                justify-center
                rounded-md px-3 
                py-2 text-sm 
                font-semibold
              text-white 
                shadow-sm
                focus-visible:outline
                focus-visible:outline-2 
                focus-visible:outline-offset-2`,
                disabled && "opacity-50 cursor-default",
                secondary ? 'text-gray-900' : 'text-white',
                danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
                fullWidth && "w-full",
                !secondary && !danger && 'bg-sky-600 hover:bg-sky-700 focus-visible:outline-sky-600',)}
        >
            {children}
        </button >
    )
}

export default Button