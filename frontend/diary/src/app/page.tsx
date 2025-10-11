"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Diary</h1>
      <p className="text-gray-600 mb-8">あなたの日々の記録を残しましょう。</p>

      <Link
        href="/create"
        className="bg-blue-600 text-white px-5 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
      >
        新しい日記を書く
      </Link>
    </div>
  );
}