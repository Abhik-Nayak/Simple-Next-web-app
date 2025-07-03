// src/app/[shortId]/page.tsx
import { redirect } from 'next/navigation'
import { connectToDB } from '@/lib/mongodb'
import Url from '@/models/Url'

type Props = {
    params: { shortId: string }
}

export default async function RedirectPage({ params }: Props) {
    const { shortId } = params

    await connectToDB()

    const url = await Url.findOne({ shortId })

    if (url) {
        const now = new Date()

        // Check for expiration
        if (url.expiresAt && url.expiresAt < now) {
            return (
                <div className="flex items-center justify-center h-screen text-red-500 text-lg font-semibold">
                    This link has expired ⌛
                </div>
            )
        }

        url.clicks += 1
        await url.save()
        redirect(url.originalUrl)
    }


    return (
        <div className="flex items-center justify-center h-screen text-red-500 text-lg font-semibold">
            Short URL not found or expired.
        </div>
    )
}
