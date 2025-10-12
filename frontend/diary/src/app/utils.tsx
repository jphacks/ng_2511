"use client";

import { useState } from "react";
import { HomePageProps } from "./static";

export async function getDiaryByDate(date: string): Promise<string> {
  try {
    const res = await fetch(`/diaries/${date}`, {
      method: 'GET',
    });

    if (!res.ok) {
    //   console.error(`Failed to fetch diary for ${date}:`, res.statusText);
      return "";
    }

    const data: { body: string } = await res.json();
    return data.body;
  } catch (error) {
    console.error(`Error fetching diary for ${date}:`, error);
    return "";
  }
}

export async function getDiaryMassage(date: string = new Date().toISOString().split("T")[0]): Promise<string> {
    const diary = await getDiaryByDate(date);
    if (diary) {
      return "日記の続きを書く";
    } else {
      return "新しい日記を書く";
    }
}

export function InputDiaryForm({diary, isEdit}: HomePageProps = { diary: { id: 0, date: "", body: "" }, isEdit: false }) {
  const [diaryText, setDiaryText] = useState(diary.body);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isGenerating, setIsGenerating] = useState(false); //  画像生成中フラグを追加

  const today = new Date();
  const defaultDateObj = diary.date ? new Date(diary.date) : today;
  const [date, setDate] = useState<Date>(defaultDateObj);
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

    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("日記の送信に失敗しました。");
      setIsGenerating(false);
    }
  };
  return <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            placeholder="今日の気持ちや出来事を書いてみよう..."
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold 
                       transition duration-200
                       hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-200 
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
}
