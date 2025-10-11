'use client';

import { useState } from 'react';

interface CalendarProps {
  diaryDates: string[]; // 日記が存在する日付の配列
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export default function Calendar({ diaryDates, selectedDate, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 現在の年月を取得
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // カレンダー表示のための配列を作成
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // 週の最初から開始

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // 週の最後まで

  const calendarDays = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 日付を YYYY-MM-DD 形式にフォーマット
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 日付が現在の月かどうかチェック
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  // 日記が存在する日付かどうかチェック
  const hasDiary = (date: Date) => {
    return diaryDates.includes(formatDate(date));
  };

  // 選択中の日付かどうかチェック
  const isSelected = (date: Date) => {
    return selectedDate === formatDate(date);
  };

  // 前の月へ移動
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 次の月へ移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 日付をクリックした時の処理
  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    // 現在の月の日付のみ選択可能
    if (isCurrentMonth(date)) {
      onDateSelect(selectedDate === dateStr ? null : dateStr);
    }
  };

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="calendar">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-gray-800">
          {year}年 {monthNames[month]}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonthDate = isCurrentMonth(date);
          const hasEntry = hasDiary(date);
          const isSelectedDate = isSelected(date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!isCurrentMonthDate}
              className={`
                w-full h-10 text-sm flex items-center justify-center rounded-lg transition-all
                ${isCurrentMonthDate ? 'text-gray-900' : 'text-gray-300'}
                ${isCurrentMonthDate
                  ? 'hover:bg-gray-100 cursor-pointer border-2 border-transparent'
                  : 'cursor-default border-2 border-transparent'
                }
                ${hasEntry
                  ? 'bg-blue-100 border-blue-300'
                  : ''
                }
                ${isSelectedDate ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
            >
              <span className="relative">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span>日記あり</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>選択中</span>
        </div>
      </div>
    </div>
  );
}