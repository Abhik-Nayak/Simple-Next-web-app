import React from 'react'
import { IconType } from 'react-icons';

type Props = {
    icon: IconType;
    onClick: () => void;
}

const AuthSocialButton = ({icon :Icon, onClick}: Props) => {
  return (
    <button type='button' onClick={onClick} className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600'>
        <Icon size={24} />
    </button>
  )
}

export default AuthSocialButton