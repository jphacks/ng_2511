"use client";

import "./globals.css";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { devUserImage } from "./static";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 画像を取得
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/image", { method: "GET" });
        // if (!res.ok) throw new Error("画像取得に失敗しました");
        if (!res.ok){
          // 開発環境ならdevUserImageを使う
          const url = devUserImage;
          setImageUrl(url);
          return;
        }

        // 画像のURLを生成（Blob → object URL）
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        
        setImageUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    fetchImage();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 左側：アイコン＋サービス名 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blue-600 text-2xl">📝</span>
          <span className="font-semibold text-lg">My Diary</span>
        </Link>

        {/* 右側：メニュー＋画像 */}
        <div className="flex items-center gap-4">
          {/* プルダウンメニュー */}
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
                  href="/"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  ホーム
                </Link>
                <Link
                  href="/create"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  新しい日記を書く
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

          {/* 取得した画像を表示 */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="ユーザー画像"
              className="w-10 h-10 rounded-full border object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}