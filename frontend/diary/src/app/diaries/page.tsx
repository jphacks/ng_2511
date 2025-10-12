'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Calendar from './components/Calendar';
import DiaryList from './components/DiaryList';
import { DiaryEntry, fetchDiaries, getDiaryDates, sortDiariesByDate } from './api';
import { InputDiaryForm } from '../utils';
import { Diary } from '../static';
import { formatDateToSimpleJapanese } from '../../utils/dateFormat';


// int型日付をYYYY-MM-DD文字列に変換
function intToDateString(dateInt: number): string {
  const s = dateInt.toString();
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
}



export default function DiariesPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diary, setDiary] = useState<Diary>({ id: 0, date: "", body: "" });
  const [isEdit, setIsEdit] = useState(false);

  const fetchDiary = async (date: number | null) => {
    if (!date) {
      setDiary({ id: 0, date: "", body: "" });
      setIsEdit(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/v1/diaries/date/${date}`, {
        method: "GET",
      });

        if (res.status === 404) {
          setDiary({ id: 0, date: "", body: "" });
          setIsEdit(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`サーバーエラー: ${res.status}`);
        }
         
        const data = await res.json();
        setDiary(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

  useEffect(() => {
    // APIから日記データを取得
    const loadDiaries = async () => {
      try {
        setLoading(true);
        const fetchedDiaries = await fetchDiaries();
        const sortedDiaries = sortDiariesByDate(fetchedDiaries);
        setDiaries(sortedDiaries);
        setFilteredDiaries(sortedDiaries);
        setError(null);
      } catch (err) {
        console.error('Error loading diaries:', err);
        setError('日記の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadDiaries();
  }, []);

  useEffect(() => {
    if (selectedDate !== null) {
      const filtered = diaries.filter(diary => diary.date === selectedDate);
      setFilteredDiaries(filtered);
    } else {
      setFilteredDiaries(diaries);
    }
  }, [selectedDate, diaries]);

  // 日記が存在する日付の配列を作成
  const diaryDates = getDiaryDates(diaries);

  const handleDateSelect = (date: number | null) => {
    setSelectedDate(date);
    fetchDiary(date);
    setIsEdit(date !== null);
  };

  const fetchAndSetDiaries = async () => {
    try {
      setLoading(true);
      const fetchedDiaries = await fetchDiaries();
      const sortedDiaries = sortDiariesByDate(fetchedDiaries);
      setDiaries(sortedDiaries);
      setFilteredDiaries(sortedDiaries);
      setError(null);
    } catch (err) {
      console.error('Error loading diaries:', err);
      setError('日記の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const RightSide = () => {
    if (selectedDate === null){
      return (
        <div>
        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                日記一覧
              </h2>
            </div>
        <div className="bg-white rounded-lg shadow-md p-6">
            
            <DiaryList
              diaries={filteredDiaries}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              intToDateString={intToDateString}
            />
          </div>
        </div>
            );
    }
    else{
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
            {formatDateToSimpleJapanese(selectedDate)}の日記を{isEdit ? "編集" : "作成"}中
            </h2> 
          {selectedDate && (
            <button
                  onClick={() => handleDateSelect(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  すべて表示
                </button>
              )}
            </div>

          <InputDiaryForm diary={diary} isEdit={isEdit} writeDiaryDate={selectedDate} onSuccess={fetchAndSetDiaries} />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">日記を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            日記一覧
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: カレンダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              カレンダー
            </h2>
            <Calendar
              diaryDates={diaryDates}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* 右側: 日記一覧 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <RightSide />
          </div>
        </div>
      </div>
    </div>
  );
}