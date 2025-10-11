"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import HomePage from "../../create/page";
import { Diary } from "./type";

function intToDateString(dateInt: number): string {
  const s = dateInt.toString();
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
}


export default function EditPage() {
  const { date } = useParams();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    
    if (!date) return;
     
    const fetchDiary = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/diaries/date/${date}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`サーバーエラー: ${res.status}`);
        }
         
        const data = await res.json();
        setDiary(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDiary();
  }, [date]);


  if (error) return <p>エラーが発生しました: {error}</p>;
  if (!diary) return <p>読み込み中...</p>;
  diary.date = intToDateString(Number(date));
    return (
        <HomePage diary={diary || { id: 0, date: "", body: "" }} isEdit={true} />
    );
}
