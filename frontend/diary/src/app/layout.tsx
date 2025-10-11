"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 左側：アイコン＋サービス名 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blue-600 text-2xl">📝</span>
          <span className="font-semibold text-lg">My Diary</span>
        </Link>

        {/* 右側：プルダウンメニュー */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-100"
          >
            メニュー
            <ChevronDown
              size={16}
              className={`transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2">
              <Link
                href="/diaries/create"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                新しい日記を書く
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                ホーム
              </Link>
              <Link
                href="/diaries"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                日記一覧
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
