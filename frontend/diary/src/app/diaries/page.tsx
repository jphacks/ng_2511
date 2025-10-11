'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Calendar from './components/Calendar';
import DiaryList from './components/DiaryList';
import { DiaryEntry, mockDiaries, getDiaryDates, sortDiariesByDate } from '../../data/mockDiaries';

export default function DiariesPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    // 実際の実装ではAPIからデータを取得
    const sortedDiaries = sortDiariesByDate(mockDiaries);
    setDiaries(sortedDiaries);
    setFilteredDiaries(sortedDiaries);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = diaries.filter(diary => diary.date === selectedDate);
      setFilteredDiaries(filtered);
    } else {
      setFilteredDiaries(diaries);
    }
  }, [selectedDate, diaries]);

  // 日記が存在する日付の配列を作成
  const diaryDates = getDiaryDates();

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            日記一覧
          </h1>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しい日記を作成
          </Link>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                日記一覧
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
            <DiaryList
              diaries={filteredDiaries}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}