# 🔗 URL Shortener App

A full-stack **URL Shortener** built using **Next.js App Router**, **MongoDB**, and **Tailwind CSS**.  
It allows users to generate shortened URLs, track click analytics, and set expiration dates for links.

---

## 🚀 Features

- ✅ Shorten long URLs into compact links
- 📈 Track how many times a link has been clicked
- ⏳ Optional expiration for each shortened URL
- 🔗 Copy-to-clipboard support for ease of use
- 🧠 Optimized with Mongoose + Server Components

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS
- **Backend**: Next.js API routes, Mongoose
- **Database**: MongoDB (MongoDB Atlas or Local)
- **Utility**: `nanoid` for generating unique short codes

---

## 🧩 Project Structure

```

src/
├── app/
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts       → API to shorten URLs
│   ├── \[shortId]/              → Dynamic route to redirect
│   │   └── page.tsx
│   └── page.tsx                → Main input form UI
├── lib/
│   └── mongodb.ts              → MongoDB connection helper
├── models/
│   └── Url.ts                  → Mongoose URL schema

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Replace `your_mongodb_connection_string` with your MongoDB URI.

### 4️⃣ Run the App

```bash
npm run dev
```

Visit 👉 `http://localhost:3000`

---

## ✨ Features Explained

### 🔧 URL Shortening

* Enter a long URL and receive a shortened version like:

  ```
  http://localhost:3000/abc123
  ```

### 🔁 Redirect

* Visiting `/abc123` will redirect to the original URL (if not expired).

### 📈 Click Tracking

* Each time a short link is clicked, a counter (`clicks`) is incremented in the database.

### ⏳ Expiration (Optional)

* You can choose how many days the URL should stay active.
* Expired URLs will show a message: `This link has expired`.

---

## 📁 Example API Payload

### `POST /api/shorten`

**Request Body:**

```json
{
  "originalUrl": "https://example.com/very/long/path",
  "expiresInDays": 3
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:3000/xyz123",
  "clicks": 0
}
```

---

## 📌 Todos (Next Steps)

* 🔐 Add authentication (Google login / JWT)
* 📊 Create a dashboard for users to view their links
* 🗑️ Add delete & edit support
* 🚀 Deploy to Vercel + MongoDB Atlas

---

## 📄 License

MIT License © 2025 \Abhik Nayak