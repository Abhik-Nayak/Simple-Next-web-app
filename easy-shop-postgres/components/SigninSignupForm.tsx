'use client'
import React, { useState } from 'react'

type Props = {}

const SigninSignupForm = (props: Props) => {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div>
            <div className='flex justify-between mb-4'>
                <button
                    className={`w-1/2 py-2 ${isLogin ? "font-bold border-b-2 border-blue-600" : ""
                        }`}
                    onClick={() => setIsLogin(true)}
                >
                    Sign In
                </button>
                <button
                    className={`w-1/2 py-2 ${!isLogin ? "font-bold border-b-2 border-blue-600" : ""
                        }`}
                    onClick={() => setIsLogin(false)}
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default SigninSignupForm