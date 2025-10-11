"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Diary } from "../edit/[date]/type";

interface HomePageProps {
  diary: Diary;
  isEdit: boolean;
}

export default function HomePage({ diary, isEdit }: HomePageProps = { diary: { id: 0, date: "", body: "" }, isEdit: false }) {
  if (!diary) {
    diary = { id: 0, date: "", body: "" };
  }
  if (!isEdit) {
    isEdit = false;
  }
  const [diaryText, setDiaryText] = useState(diary.body);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [score, setScore] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string>(""); // バックエンド画像URI
  const [isGenerating, setIsGenerating] = useState(false); //  画像生成中フラグを追加

  const today = new Date();
  const defaultDateObj = diary.date ? new Date(diary.date) : today;
  const [date, setDate] = useState<Date>(defaultDateObj);

  // バックエンドから最新の画像を取得
  const fetchImage = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/images/?user_id=1");
      if (!res.ok) throw new Error("画像取得に失敗しました");
      const data = await res.json();
      if (data.image_uri) {
        setImageUri(data.image_uri);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false); //  画像取得完了時に生成中フラグをOFF
    }
  };

  // 日記送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!diaryText.trim()) {
      setMessageType("error");
      setMessage("日記を入力してください。");
      return;
    }

    try {
      setIsGenerating(true); //  送信開始時に「生成中」に設定
      setMessageType("success");
      setMessage("日記を送信中です...");
      
      let response;
      if (!isEdit) {
        response = await fetch("http://localhost:8000/api/v1/diaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "body": diaryText,
            "date": Number(date.toISOString().split("T")[0].replace(/-/g, "")),
          }),
        });
      } else {
        response = await fetch(`http://localhost:8000/api/v1/diaries/${diary.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: diaryText,
            date: Number(date.toISOString().split("T")[0].replace(/-/g, "")),
          })
        })
      };
      console.log(diaryText);
      if (!response.ok) throw new Error("APIリクエストに失敗しました");
      const data = await response.json();

      setMessageType("success");
      setMessage("日記が保存されました！画像を生成しています...");
      setDiaryText("");

      //  スコアを受け取る場合
      if (typeof data.score === "number") setScore(data.score);

      //  日記送信後に画像を再取得
      await fetchImage();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("日記の送信に失敗しました。");
      setIsGenerating(false);
    }
  };

  // スコアに応じたフレーム変化
  const frameStyle =
    score === null
      ? "border-gray-300 shadow-gray-100"
      : score >= 70
      ? "border-green-400 shadow-green-200"
      : score >= 40
      ? "border-yellow-400 shadow-yellow-200"
      : "border-red-400 shadow-red-200";

  return (
    <main className="flex flex-1 items-start justify-center gap-8 px-12 py-8 bg-gray-50">
      {/* 左：未来の自分 */}
      <div className="w-1/2 flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          未来の自分の姿{" "}
          {/* {score === null ? (
            <span className="text-gray-400 text-base">(スコア計算中...)</span>
          ) : (
            `${score}点`
          )} */}
        </h2>

        <div
          className={`relative w-80 h-96 border-4 rounded-2xl shadow-lg ${frameStyle} transition-all duration-500 bg-white overflow-hidden flex items-center justify-center`}
        >
          {/*  状態に応じて表示を切り替え */}
          {!imageUri && !isGenerating && (
            <p className="text-gray-400 text-sm">ここに画像が生成されます</p>
          )}

          {isGenerating && !imageUri && (
            <p className="text-indigo-400 text-sm animate-pulse">画像生成中...</p>
          )}

          {imageUri && !isGenerating && (
            <img
              src={imageUri}
              alt="未来の自分"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* 右：日記フォーム */}
      <div className="w-1/2 max-w-lg bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">日記を入力</h2>

          {/* 日付選択 */}
          <div className="relative">
            <DatePicker
              selected={date}
              onChange={(d) => d && setDate(d)}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
              className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 text-sm
                focus:ring-2 focus:ring-indigo-400 outline-none
                hover:bg-indigo-50 hover:text-gray-900
                cursor-pointer transition-colors duration-200"
            />
          </div>
        </div>

        {/* フォーム本体 */}
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
            className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold 
                       transition duration-200
                       hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-200 
                       cursor-pointer"
            disabled={isGenerating} // 生成中は二重送信防止
          >
            {isGenerating ? "生成中..." : "送信"}
          </button>

          {/* メッセージ表示 */}
          {message && (
            <p
              className={`text-sm mt-1 ${
                messageType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
