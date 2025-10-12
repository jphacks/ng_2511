"use client";

import "./globals.css";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { devUserImage } from "./static";
import Image from "next/image";
import icon from "@/public/logo/logo.png"; // 変更

type ImageResponse = {
  uri: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      {/* 変更 */}
      <body className="bg-gradient-to-b from-green-50 to-emerald-50 min-h-screen text-gray-800">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const user_id = 1; // 仮のユーザーID

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/images?user_id=1`, { method: "GET" });
        if (!res.ok) throw new Error("画像取得に失敗しました");

        // 画像のURLを生成（Blob → object URL）
        const data: ImageResponse = await res.json();
        setImageUri(data.uri);

      } catch (err) {
        console.error(err);
      }
    };
    fetchImage();
  }, []);

  return (
    // 変更
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-100 to-emerald-100 shadow-sm z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 左側：ロゴ＋サービス名 */}
        <Link href="/diaries" className="flex items-center gap-2">
          {/* 変更 */}
          <Image
            src={icon} // publicフォルダに配置
            alt="ミライかもね ロゴ"
            width={32}
            height={32}
            className="rounded-sm"
          />

          {/* 変更*/}
          <span className="font-semibold text-lg text-emerald-700">
            ミライかもね
          </span>
        </Link>

        {/* 右側：メニュー＋画像 */}
        <div className="flex items-center gap-4">
          {/* プルダウンメニュー */}
          <div className="relative">
            {/* 変更*/}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 px-3 py-2 border border-emerald-300 rounded-lg bg-white hover:bg-emerald-50 transition"
            >
              メニュー
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* 変更*/}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2">
                <Link
                  href="/diaries"
                  className="block px-4 py-2 text-sm hover:bg-emerald-50"
                  onClick={() => setOpen(false)}
                >
                  日記一覧
                </Link>
              </div>
            )}
          </div>

          {/* 取得した画像を表示 */}
          {imageUri ? (
            <img
              src={imageUri}
              alt="ユーザー画像"
              className="w-10 h-10 rounded-full border-2 border-emerald-200 object-cover shadow-sm"
            />
          ) : (
            // 変更
            <div className="w-10 h-10 rounded-full bg-emerald-100 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
