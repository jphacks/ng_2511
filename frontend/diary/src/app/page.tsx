"use client";

import Link from "next/link";
import Image from "next/image";
import icon from "@/public/logo/logo.png"; // 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-6">
      {/* アイコン */}
      <Image
        src={icon}
        alt="ミライかもね アイコン"
        width={120}
        height={120}
        className="mb-4"
      />

      {/* タイトル */}
      <h1 className="text-4xl font-bold text-emerald-700 mb-3">ミライかもね</h1>

      {/* サブテキスト */}
      <p className="text-gray-600 text-center mb-8">
        日記が描く、もうひとりのミライ
      </p>

      {/* ボタン群 */}
      <Link
        href="/create"
        className="bg-emerald-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-emerald-600 transition"
      >
        日記を書く
      </Link>
      <Link
        href="/upload_image"
        className="mt-4 text-emerald-700 hover:underline"
      >
        新しい日記帳をつくる
      </Link>
    </div>
  );
}
