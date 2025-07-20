'use client'
import React from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: Props) => {
    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative'>
                <button onClick={onClose} className='absolute top-2 right-3 text-gray-600 text-xl'>&times; </button>
                {children}
            </div>
        </div>
    )
}

export default Modal