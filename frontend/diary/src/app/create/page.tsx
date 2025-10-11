"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  // ---- 状態管理 ----
  const [diaryText, setDiaryText] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState<number>(70);

  // デモ用：スコア変化（後でAPIと連携予定）
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => (s > 90 ? 30 : s + 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 日記送信処理（仮）
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!diaryText.trim()) {
    setMessage("日記を入力してください。");
    return;
  }

  try {
    //  FastAPI の API に送信
    const response = await fetch("http://localhost:8000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: diaryText, // ← FastAPI が受け取るキー名をここで指定
      }),
    });

    if (!response.ok) {
      throw new Error("APIリクエストに失敗しました");
    }

    const data = await response.json();

    // サーバー側がスコアなどを返す想定
    if (data.score !== undefined) {
      setScore(data.score);
    }

    setMessage("日記が保存されました！");
    setDiaryText("");
  } catch (error) {
    console.error(error);
    setMessage("日記の送信に失敗しました。");
  }
};

  // スコアに応じたスタイル変化
  const frameStyle =
    score >= 70
      ? "border-green-400 shadow-green-200"
      : score >= 40
      ? "border-yellow-400 shadow-yellow-200"
      : "border-red-400 shadow-red-200";
  // スコアに応じた画像変化
  const imageSrc =
    score >= 70
      ? "/images/future_positive.png"
      : score >= 40
      ? "/images/future_normal.png"
      : "/images/future_negative.png";

  return (
    // layout.tsx の中に包まれて表示される部分
    <main className="flex flex-1 items-start justify-center gap-8 px-12 py-8 bg-gray-50">
      {/* 左：未来の自分 */}
      <div className="w-1/2 flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          未来の自分の姿 {score} / 100
        </h2>

        <div
          className={`relative w-80 h-96 border-4 rounded-2xl shadow-lg ${frameStyle} transition-all duration-500 bg-white overflow-hidden`}
        >
          <img
            src={imageSrc}
            alt="未来の自分"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 transition-all ${
              score >= 70
                ? "bg-green-50/10"
                : score >= 40
                ? "bg-yellow-50/20"
                : "bg-red-200/20"
            }`}
          ></div>
        </div>
      </div>

      {/* 右：日記フォーム */}
      <div className="w-1/2 max-w-lg bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">日記を入力</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="今日の気持ちや出来事を書いてみよう..."
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition"
          >
            保存
          </button>
        </form>

        {message && (
          <p className="text-sm text-green-600 mt-3 text-center">{message}</p>
        )}
      </div>
    </main>
  );
}
