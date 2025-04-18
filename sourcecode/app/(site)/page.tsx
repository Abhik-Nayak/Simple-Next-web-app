import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
    return (
        <div className="flex h-screen flex-col justify-center py-12 sm:px-8 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:max-w-md">
                <Image alt="Logo" height='58' width='58' className="mx-auto" src="/logo.webp" />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account!
                </h2>
            </div>
            <AuthForm/>
        </div>
    );
}
