"use client";

import Link from "next/link";
import Image from "next/image";
import icon from "@/public/logo/logo.png";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-6 overflow-hidden">

      {/* 左右の木 */}
      <Image
        src="/decorations/tree-left.png"
        alt="左の木"
        width={220}
        height={220}
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-80 md:left-4 select-none pointer-events-none"
      />
      <Image
        src="/decorations/tree-right.png"
        alt="右の木"
        width={220}
        height={220}
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-80 md:right-4 select-none pointer-events-none"
      />

      {/* 背景の舞う葉っぱ */}
      <Image
        src="/decorations/leaves.png"
        alt="舞う葉っぱ"
        fill
        className="absolute top-0 left-0 w-full h-full opacity-8 select-none pointer-events-none object-cover"
      />

      {/* 中央コンテンツ */}
      <div className="relative z-10 text-center">
        <Image
          src={icon}
          alt="ミライかもね アイコン"
          width={120}
          height={120}
          className="mb-4 mx-auto"
        />

        <h1 className="text-4xl font-bold text-emerald-700 mb-3">
          ミライかもね
        </h1>

        <p className="text-gray-600 text-center mb-8 text-lg">
          日記が描く、もうひとりのミライ
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/diaries"
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-emerald-600 transition"
          >
            日記を始める
          </Link>
          <Link
            href="/upload_image"
            className="text-emerald-700 hover:underline"
          >
            新しい日記帳をつくる
          </Link>
        </div>
      </div>
    </div>
  );
}
