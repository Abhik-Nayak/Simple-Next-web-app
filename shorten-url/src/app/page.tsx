'use client'

import { useState } from 'react'

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [clicks, setClicks] = useState<number | null>(null);
  const [expiryDays, setExpiryDays] = useState(7) // Default to 7 days


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShortUrl('')
    setCopied(false)
    setLoading(true)

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, expiresInDays: expiryDays })

      })

      const data = await res.json()

      if (res.ok) {
        setShortUrl(data.shortUrl)
        setClicks(data.clicks || 0)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Something went wrong'+err)
    }

    setLoading(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-8">🔗 URL Shortener</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <input
          type="url"
          required
          placeholder="Enter a long URL..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Expires in days (optional)"
          min={1}
          value={expiryDays}
          onChange={(e) => setExpiryDays(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-md w-full text-center">
          <p className="mb-2 text-gray-700">Shortened URL:</p>
          <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="ml-4 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* // Show below shortUrl */}
      {clicks !== null && (
        <p className="mt-2 text-sm text-gray-600">🔄 Visited {clicks} times</p>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      )}
    </main>
  )
}
